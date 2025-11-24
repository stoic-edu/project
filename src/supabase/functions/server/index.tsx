import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
import { nutritionData } from "./seed-nutrition.tsx";
const app = new Hono();
// Local debug: log every request and user role
app.use('*', async (c, next)=>{
  console.log('REQUEST:', {
    method: c.req.method,
    url: c.req.url,
    headers: c.req.header()
  });
  await next();
});
// Enable logger
app.use('*', logger(console.log));
// Enable CORS for all routes and methods
app.use("/*", cors({
  origin: "*",
  allowHeaders: [
    "Content-Type",
    "Authorization"
  ],
  allowMethods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS"
  ],
  exposeHeaders: [
    "Content-Length"
  ],
  maxAge: 600
}));
// Helper to verify auth
async function verifyAuth(authHeader) {
  if (!authHeader) return null;
  const accessToken = authHeader.split(' ')[1];
  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return null;
  return user;
}
// Helper: check if role is any admin (case-insensitive)
function isAdminRole(role) {
  if (!role) return false;
  const allowed = [
    'SYSTEM_ADMIN',
    'CAFETERIA_ADMIN',
    'ADMIN',
    'SUPER_ADMIN',
    'system_admin',
    'cafeteria_admin',
    'admin',
    'super_admin'
  ];
  return allowed.includes(role);
}
// Health check endpoint
app.get("/make-server-493cc528/health", (c)=>{
  return c.json({
    status: "ok"
  });
});
// Reset all users - development only
app.post("/make-server-493cc528/auth/reset-all", async (c)=>{
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    // Get all users from KV store
    const users = await kv.getByPrefix('user:');
    // Delete each user from Supabase Auth and KV store
    for (const user of users){
      try {
        await supabase.auth.admin.deleteUser(user.id);
        await kv.del(user:${user.id});
        await kv.del(budget:${user.id});
        // Delete user transactions
        const transactions = await kv.getByPrefix(transaction:${user.id}:);
        for (const transaction of transactions){
          await kv.del(transaction:${user.id}:${transaction.id});
        }
      } catch (error) {
        console.log(Error deleting user ${user.id}: ${error});
      }
    }
    return c.json({
      success: true,
      message: Reset ${users.length} users
    });
  } catch (error) {
    console.log(Reset error: ${error});
    return c.json({
      error: "Internal server error during reset"
    }, 500);
  }
});
// Delete specific users by email - development only
app.post("/make-server-493cc528/auth/delete-users", async (c)=>{
  try {
    const { emails } = await c.req.json();
    if (!emails || !Array.isArray(emails)) {
      return c.json({
        error: "emails array is required"
      }, 400);
    }
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const results = [];
    for (const email of emails){
      try {
        // List all users from Supabase Auth to find by email
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
          console.log(Error listing users: ${listError.message});
          results.push({
            email,
            success: false,
            error: listError.message
          });
          continue;
        }
        const userToDelete = users.find((u)=>u.email === email);
        if (!userToDelete) {
          results.push({
            email,
            success: false,
            error: "User not found"
          });
          continue;
        }
        // Delete from Supabase Auth
        await supabase.auth.admin.deleteUser(userToDelete.id);
        // Delete from KV store
        await kv.del(user:${userToDelete.id});
        await kv.del(budget:${userToDelete.id});
        // Delete user transactions
        const transactions = await kv.getByPrefix(transaction:${userToDelete.id}:);
        for (const transaction of transactions){
          await kv.del(transaction:${userToDelete.id}:${transaction.id});
        }
        results.push({
          email,
          success: true,
          message: "User deleted successfully"
        });
      } catch (error) {
        console.log(Error deleting user ${email}: ${error});
        results.push({
          email,
          success: false,
          error: String(error)
        });
      }
    }
    return c.json({
      success: true,
      results
    });
  } catch (error) {
    console.log(Delete users error: ${error});
    return c.json({
      error: "Internal server error during user deletion"
    }, 500);
  }
});
// ===== AUTH ROUTES =====
// Sign up with role
app.post("/make-server-493cc528/auth/signup", async (c)=>{
  try {
    const { email, password, name, role } = await c.req.json();
    if (!email || !password || !name || !role) {
      return c.json({
        error: "Missing required fields"
      }, 400);
    }
    const validRoles = [
      'STUDENT',
      'CAFETERIA_ADMIN',
      'SYSTEM_ADMIN'
    ];
    if (!validRoles.includes(role)) {
      return c.json({
        error: "Invalid role"
      }, 400);
    }
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        role
      },
      email_confirm: true // Automatically confirm since email server isn't configured
    });
    if (error) {
      console.log(Signup error: ${error.message});
      return c.json({
        error: error.message
      }, 400);
    }
    // Store user profile in KV
    const userProfile = {
      id: data.user.id,
      email,
      name,
      role,
      createdAt: new Date().toISOString()
    };
    await kv.set(user:${data.user.id}, userProfile);
    // Initialize student budget if role is STUDENT
    if (role === 'STUDENT') {
      await kv.set(budget:${data.user.id}, {
        userId: data.user.id,
        dailyBudget: 500,
        weeklyBudget: 3500,
        currentSpending: 0
      });
    }
    return c.json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    console.log(Signup error: ${error});
    return c.json({
      error: "Internal server error during signup"
    }, 500);
  }
});
// Get current user profile
app.get("/make-server-493cc528/auth/me", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const profile = await kv.get(user:${user.id});
    if (!profile) {
      return c.json({
        error: "Profile not found"
      }, 404);
    }
    return c.json(profile);
  } catch (error) {
    console.log(Get profile error: ${error});
    return c.json({
      error: "Internal server error getting profile"
    }, 500);
  }
});
// ===== MENU ROUTES =====
// Get menu for a specific date
app.get("/make-server-493cc528/menu/:date", async (c)=>{
  try {
    const date = c.req.param('date');
    const menu = await kv.get(menu:${date});
    if (!menu) {
      return c.json({
        items: []
      });
    }
    return c.json(menu);
  } catch (error) {
    console.log(Get menu error: ${error});
    return c.json({
      error: "Internal server error getting menu"
    }, 500);
  }
});
// Create/Update menu (Cafeteria Admin only)
app.post("/make-server-493cc528/menu", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const profile = await kv.get(user:${user.id});
    if (!profile || !isAdminRole(profile.role)) {
      return c.json({
        error: "Forbidden - Cafeteria Admin access required"
      }, 403);
    }
    const { date, items } = await c.req.json();
    if (!date || !items) {
      return c.json({
        error: "Missing date or items"
      }, 400);
    }
    const menu = {
      date,
      items,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };
    await kv.set(menu:${date}, menu);
    return c.json({
      success: true,
      menu
    });
  } catch (error) {
    console.log(Create/update menu error: ${error});
    return c.json({
      error: "Internal server error creating menu"
    }, 500);
  }
});
// Delete menu item (Cafeteria Admin only)
app.delete("/make-server-493cc528/menu/:date/:itemId", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const profile = await kv.get(user:${user.id});
    if (!profile || !isAdminRole(profile.role)) {
      return c.json({
        error: "Forbidden - Cafeteria Admin access required"
      }, 403);
    }
    const date = c.req.param('date');
    const itemId = c.req.param('itemId');
    const menu = await kv.get(menu:${date});
    if (!menu) {
      return c.json({
        error: "Menu not found"
      }, 404);
    }
    menu.items = menu.items.filter((item)=>item.id !== itemId);
    menu.updatedAt = new Date().toISOString();
    await kv.set(menu:${date}, menu);
    return c.json({
      success: true,
      menu
    });
  } catch (error) {
    console.log(Delete menu item error: ${error});
    return c.json({
      error: "Internal server error deleting menu item"
    }, 500);
  }
});
// ===== NUTRITION ROUTES =====
// Get all nutrition data
app.get("/make-server-493cc528/nutrition", async (c)=>{
  try {
    const nutritionData = await kv.getByPrefix('nutrition:');
    return c.json(nutritionData);
  } catch (error) {
    console.log(Get nutrition error: ${error});
    return c.json({
      error: "Internal server error getting nutrition data"
    }, 500);
  }
});
// Seed nutrition database with dummy data
app.post("/make-server-493cc528/nutrition/seed", async (c)=>{
  try {
    // Check if already seeded
    const existing = await kv.getByPrefix('nutrition:');
    if (existing.length > 0) {
      return c.json({
        message: "Nutrition database already seeded",
        count: existing.length
      });
    }
    // Seed the database
    let seededCount = 0;
    for (const item of nutritionData){
      const id = crypto.randomUUID();
      const nutrition = {
        id,
        ...item,
        createdAt: new Date().toISOString(),
        seeded: true
      };
      await kv.set(nutrition:${id}, nutrition);
      seededCount++;
    }
    return c.json({
      success: true,
      message: Seeded ${seededCount} nutrition entries
    });
  } catch (error) {
    console.log(Seed nutrition error: ${error});
    return c.json({
      error: "Internal server error seeding nutrition data"
    }, 500);
  }
});
// Create nutrition entry (Cafeteria Admin only)
app.post("/make-server-493cc528/nutrition", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const profile = await kv.get(user:${user.id});
    if (!profile || !isAdminRole(profile.role)) {
      return c.json({
        error: "Forbidden - Cafeteria Admin access required"
      }, 403);
    }
    const nutritionData = await c.req.json();
    const id = crypto.randomUUID();
    const nutrition = {
      id,
      ...nutritionData,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };
    await kv.set(nutrition:${id}, nutrition);
    return c.json({
      success: true,
      nutrition
    });
  } catch (error) {
    console.log(Create nutrition error: ${error});
    return c.json({
      error: "Internal server error creating nutrition data"
    }, 500);
  }
});
// Update nutrition entry (Cafeteria Admin only)
app.put("/make-server-493cc528/nutrition/:id", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const profile = await kv.get(user:${user.id});
    if (!profile || !isAdminRole(profile.role)) {
      return c.json({
        error: "Forbidden - Cafeteria Admin access required"
      }, 403);
    }
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(nutrition:${id});
    if (!existing) {
      return c.json({
        error: "Nutrition data not found"
      }, 404);
    }
    const nutrition = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };
    await kv.set(nutrition:${id}, nutrition);
    return c.json({
      success: true,
      nutrition
    });
  } catch (error) {
    console.log(Update nutrition error: ${error});
    return c.json({
      error: "Internal server error updating nutrition data"
    }, 500);
  }
});
// Delete nutrition entry (Cafeteria Admin only)
app.delete("/make-server-493cc528/nutrition/:id", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const profile = await kv.get(user:${user.id});
    if (!profile || !isAdminRole(profile.role)) {
      return c.json({
        error: "Forbidden - Cafeteria Admin access required"
      }, 403);
    }
    const id = c.req.param('id');
    await kv.del(nutrition:${id});
    return c.json({
      success: true
    });
  } catch (error) {
    console.log(Delete nutrition error: ${error});
    return c.json({
      error: "Internal server error deleting nutrition data"
    }, 500);
  }
});
// ===== BUDGET ROUTES =====
// Get user budget
app.get("/make-server-493cc528/budget", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const budget = await kv.get(budget:${user.id});
    if (!budget) {
      // Create default budget
      const defaultBudget = {
        userId: user.id,
        dailyBudget: 500,
        weeklyBudget: 3500,
        currentSpending: 0
      };
      await kv.set(budget:${user.id}, defaultBudget);
      return c.json(defaultBudget);
    }
    return c.json(budget);
  } catch (error) {
    console.log(Get budget error: ${error});
    return c.json({
      error: "Internal server error getting budget"
    }, 500);
  }
});
// Update user budget
app.put("/make-server-493cc528/budget", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const { dailyBudget, weeklyBudget } = await c.req.json();
    const existing = await kv.get(budget:${user.id}) || {
      currentSpending: 0
    };
    const budget = {
      ...existing,
      userId: user.id,
      dailyBudget,
      weeklyBudget,
      updatedAt: new Date().toISOString()
    };
    await kv.set(budget:${user.id}, budget);
    return c.json({
      success: true,
      budget
    });
  } catch (error) {
    console.log(Update budget error: ${error});
    return c.json({
      error: "Internal server error updating budget"
    }, 500);
  }
});
// ===== TRANSACTION ROUTES =====
// Get user transactions
app.get("/make-server-493cc528/transactions", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const transactions = await kv.getByPrefix(transaction:${user.id}:);
    return c.json(transactions.sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime()));
  } catch (error) {
    console.log(Get transactions error: ${error});
    return c.json({
      error: "Internal server error getting transactions"
    }, 500);
  }
});
// Add transaction
app.post("/make-server-493cc528/transactions", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const { itemName, amount, category, nutritionInfo } = await c.req.json();
    const id = crypto.randomUUID();
    const transaction = {
      id,
      userId: user.id,
      itemName,
      amount,
      category,
      nutritionInfo,
      date: new Date().toISOString()
    };
    await kv.set(transaction:${user.id}:${id}, transaction);
    // Update current spending in budget
    const budget = await kv.get(budget:${user.id});
    if (budget) {
      budget.currentSpending = (budget.currentSpending || 0) + amount;
      await kv.set(budget:${user.id}, budget);
    }
    return c.json({
      success: true,
      transaction
    });
  } catch (error) {
    console.log(Add transaction error: ${error});
    return c.json({
      error: "Internal server error adding transaction"
    }, 500);
  }
});
// ===== USER MANAGEMENT ROUTES (System Admin) =====
// Get all users (System Admin only)
app.get("/make-server-493cc528/admin/users", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const profile = await kv.get(user:${user.id});
    if (!profile || !isAdminRole(profile.role)) {
      return c.json({
        error: "Forbidden - System Admin access required"
      }, 403);
    }
    const users = await kv.getByPrefix('user:');
    return c.json(users);
  } catch (error) {
    console.log(Get all users error: ${error});
    return c.json({
      error: "Internal server error getting users"
    }, 500);
  }
});
// Create user (System Admin only)
app.post("/make-server-493cc528/admin/users", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const profile = await kv.get(user:${user.id});
    if (!profile || !isAdminRole(profile.role)) {
      return c.json({
        error: "Forbidden - System Admin access required"
      }, 403);
    }
    const { email, password, name, role } = await c.req.json();
    if (!email || !password || !name || !role) {
      return c.json({
        error: "Missing required fields"
      }, 400);
    }
    const validRoles = [
      'STUDENT',
      'CAFETERIA_ADMIN',
      'SYSTEM_ADMIN'
    ];
    if (!validRoles.includes(role)) {
      return c.json({
        error: "Invalid role"
      }, 400);
    }
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        role
      },
      email_confirm: true // Automatically confirm since email server isn't configured
    });
    if (error) {
      console.log(Create user error: ${error.message});
      return c.json({
        error: error.message
      }, 400);
    }
    // Store user profile in KV
    const userProfile = {
      id: data.user.id,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };
    await kv.set(user:${data.user.id}, userProfile);
    // Initialize student budget if role is STUDENT
    if (role === 'STUDENT') {
      await kv.set(budget:${data.user.id}, {
        userId: data.user.id,
        dailyBudget: 500,
        weeklyBudget: 3500,
        currentSpending: 0
      });
    }
    return c.json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    console.log(Create user error: ${error});
    return c.json({
      error: "Internal server error creating user"
    }, 500);
  }
});
// Update user role (System Admin only)
app.put("/make-server-493cc528/admin/users/:userId", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const profile = await kv.get(user:${user.id});
    if (!profile || !isAdminRole(profile.role)) {
      return c.json({
        error: "Forbidden - System Admin access required"
      }, 403);
    }
    const userId = c.req.param('userId');
    const { role } = await c.req.json();
    const validRoles = [
      'STUDENT',
      'CAFETERIA_ADMIN',
      'SYSTEM_ADMIN'
    ];
    if (!validRoles.includes(role)) {
      return c.json({
        error: "Invalid role"
      }, 400);
    }
    const userProfile = await kv.get(user:${userId});
    if (!userProfile) {
      return c.json({
        error: "User not found"
      }, 404);
    }
    userProfile.role = role;
    userProfile.updatedAt = new Date().toISOString();
    await kv.set(user:${userId}, userProfile);
    return c.json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    console.log(Update user role error: ${error});
    return c.json({
      error: "Internal server error updating user"
    }, 500);
  }
});
// Delete user (System Admin only)
app.delete("/make-server-493cc528/admin/users/:userId", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const profile = await kv.get(user:${user.id});
    if (!profile || !isAdminRole(profile.role)) {
      return c.json({
        error: "Forbidden - System Admin access required"
      }, 403);
    }
    const userId = c.req.param('userId');
    // Check if user exists
    const userProfile = await kv.get(user:${userId});
    if (!userProfile) {
      return c.json({
        error: "User not found"
      }, 404);
    }
    // Prevent self-deletion
    if (userId === user.id) {
      return c.json({
        error: "Cannot delete your own account"
      }, 400);
    }
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    // Delete from Supabase Auth
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      console.log(Delete user from auth error: ${error.message});
      return c.json({
        error: error.message
      }, 400);
    }
    // Delete from KV store
    await kv.del(user:${userId});
    await kv.del(budget:${userId});
    // Delete user transactions
    const transactions = await kv.getByPrefix(transaction:${userId}:);
    for (const transaction of transactions){
      await kv.del(transaction:${userId}:${transaction.id});
    }
    return c.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.log(Delete user error: ${error});
    return c.json({
      error: "Internal server error deleting user"
    }, 500);
  }
});
// Get analytics/reports (System Admin only)
app.get("/make-server-493cc528/admin/analytics", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    // Use KV store for role check
    const profile = await kv.get(user:${user.id});
    const role = profile?.role;
    console.log('[DEBUG] ANALYTICS ROLE FROM KV:', {
      userId: user.id,
      role,
      profile,
      authHeader: c.req.header('Authorization')
    });
    const allowedRoles = [
      'SYSTEM_ADMIN',
      'CAFETERIA_ADMIN',
      'ADMIN',
      'SUPER_ADMIN',
      'system_admin',
      'cafeteria_admin',
      'admin',
      'super_admin'
    ];
    if (!role || !allowedRoles.includes(role)) {
      console.log('[DEBUG] ANALYTICS ACCESS DENIED:', role);
      return c.json({
        error: Forbidden - Analytics access allowed only for SYSTEM_ADMIN or CAFETERIA_ADMIN. Your role: ${role || 'none'}
      }, 403);
    }
    // Get optional date range from query params
    const url = new URL(c.req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const users = await kv.getByPrefix('user:');
    let allTransactions = await kv.getByPrefix('transaction:');
    // Filter transactions by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      allTransactions = allTransactions.filter((t)=>{
        const transactionDate = new Date(t.date);
        return transactionDate >= start && transactionDate <= end;
      });
    }
    const analytics = {
      totalUsers: users.length,
      totalStudents: users.filter((u)=>u.role === 'STUDENT').length,
      totalCafeteriaAdmins: users.filter((u)=>u.role === 'CAFETERIA_ADMIN').length,
      totalSystemAdmins: users.filter((u)=>u.role === 'SYSTEM_ADMIN').length,
      totalTransactions: allTransactions.length,
      totalRevenue: allTransactions.reduce((sum, t)=>sum + (t.amount || 0), 0),
      averageTransactionValue: allTransactions.length > 0 ? allTransactions.reduce((sum, t)=>sum + (t.amount || 0), 0) / allTransactions.length : 0
    };
    return c.json(analytics);
  } catch (error) {
    console.log(Get analytics error: ${error});
    return c.json({
      error: "Internal server error getting analytics"
    }, 500);
  }
});
// ===== PROFILE ROUTES =====
// Update user profile
app.put("/make-server-493cc528/profile", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const { name, dietPreference } = await c.req.json();
    if (name && !name.trim()) {
      return c.json({
        error: "Name cannot be empty"
      }, 400);
    }
    const profile = await kv.get(user:${user.id});
    if (!profile) {
      return c.json({
        error: "Profile not found"
      }, 404);
    }
    if (name) profile.name = name.trim();
    if (dietPreference !== undefined) profile.dietPreference = dietPreference;
    profile.updatedAt = new Date().toISOString();
    await kv.set(user:${user.id}, profile);
    return c.json({
      success: true,
      profile
    });
  } catch (error) {
    console.log(Update profile error: ${error});
    return c.json({
      error: "Internal server error updating profile"
    }, 500);
  }
});
// ===== MEAL BUDGET ROUTES =====
// Get meal budgets
app.get("/make-server-493cc528/meal-budgets", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const mealBudgets = await kv.get(mealBudgets:${user.id});
    if (!mealBudgets) {
      // Create default meal budgets
      const defaultMealBudgets = {
        userId: user.id,
        breakfast: 150,
        lunch: 200,
        supper: 150,
        createdAt: new Date().toISOString()
      };
      await kv.set(mealBudgets:${user.id}, defaultMealBudgets);
      return c.json(defaultMealBudgets);
    }
    return c.json(mealBudgets);
  } catch (error) {
    console.log(Get meal budgets error: ${error});
    return c.json({
      error: "Internal server error getting meal budgets"
    }, 500);
  }
});
// Update meal budgets
app.put("/make-server-493cc528/meal-budgets", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const { breakfast, lunch, supper } = await c.req.json();
    const mealBudgets = {
      userId: user.id,
      breakfast: breakfast || 150,
      lunch: lunch || 200,
      supper: supper || 150,
      updatedAt: new Date().toISOString()
    };
    await kv.set(mealBudgets:${user.id}, mealBudgets);
    return c.json({
      success: true,
      mealBudgets
    });
  } catch (error) {
    console.log(Update meal budgets error: ${error});
    return c.json({
      error: "Internal server error updating meal budgets"
    }, 500);
  }
});
// ===== RECOMMENDATIONS ROUTE =====
// Get meal recommendations
app.post("/make-server-493cc528/recommendations", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    const { date, mealType } = await c.req.json();
    // Get user profile for diet preference
    const profile = await kv.get(user:${user.id});
    const dietPreference = profile?.dietPreference || 'normal';
    // Get meal budgets
    const mealBudgets = await kv.get(mealBudgets:${user.id}) || {
      breakfast: 150,
      lunch: 200,
      supper: 150
    };
    const budget = mealBudgets[mealType.toLowerCase()] || 200;
    // Get menu for the date
    const menu = await kv.get(menu:${date});
    if (!menu || !menu.items) {
      return c.json({
        recommendations: [],
        message: "No menu available for this date"
      });
    }
    // Filter menu items based on diet preference, budget, and meal category
    let filteredItems = menu.items.filter((item)=>{
      // Check if item is available
      if (item.available === false) return false;
      // Check if within budget
      if (item.price > budget) return false;
      // Check if matches meal category
      const itemCategory = item.category?.toLowerCase() || '';
      const targetMealType = mealType.toLowerCase();
      // Map meal types to categories
      if (targetMealType === 'breakfast' && itemCategory !== 'breakfast') return false;
      if (targetMealType === 'lunch' && ![
        'main course',
        'side dish'
      ].includes(itemCategory)) return false;
      if (targetMealType === 'supper' && ![
        'main course',
        'side dish'
      ].includes(itemCategory)) return false;
      // Check diet preference
      if (item.nutrition) {
        const nutrition = item.nutrition;
        if (dietPreference === 'vegan') {
          // Vegan: typically high carbs, low protein, no animal products
          // For simplicity, we'll check if protein is relatively low
          if (nutrition.protein > 15) return false;
        } else if (dietPreference === 'vegetarian') {
          // Vegetarian: moderate protein, no meat
          // Similar to vegan but allows dairy/eggs
          if (nutrition.protein > 25) return false;
        } else if (dietPreference === 'keto') {
          // Keto: high fat, very low carbs, moderate protein
          if (nutrition.carbs > 20) return false;
        } else if (dietPreference === 'low-carb') {
          // Low-carb: reduced carbs
          if (nutrition.carbs > 30) return false;
        } else if (dietPreference === 'high-protein') {
          // High-protein: prioritize protein-rich foods
          if (nutrition.protein < 20) return false;
        }
      }
      return true;
    });
    // Sort recommendations by nutritional value and price
    filteredItems.sort((a, b)=>{
      // Prioritize items with nutrition data
      if (a.nutrition && !b.nutrition) return -1;
      if (!a.nutrition && b.nutrition) return 1;
      // Then sort by price (ascending) to stay within budget
      return a.price - b.price;
    });
    // Limit to top 5 recommendations
    const recommendations = filteredItems.slice(0, 5);
    return c.json({
      recommendations,
      budget,
      dietPreference,
      mealType,
      message: recommendations.length > 0 ? Found ${recommendations.length} recommendations : "No items match your preferences and budget"
    });
  } catch (error) {
    console.log(Get recommendations error: ${error});
    return c.json({
      error: "Internal server error getting recommendations"
    }, 500);
  }
});
// Get student analytics
app.get("/make-server-493cc528/student/analytics", async (c)=>{
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({
        error: "Unauthorized"
      }, 401);
    }
    // Get optional date range from query params
    const url = new URL(c.req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    let transactions = await kv.getByPrefix(transaction:${user.id}:);
    // Filter transactions by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      transactions = transactions.filter((t)=>{
        const transactionDate = new Date(t.date);
        return transactionDate >= start && transactionDate <= end;
      });
    }
    // Calculate spending by category
    const breakfastSpending = transactions.filter((t)=>t.category?.toLowerCase() === 'breakfast').reduce((sum, t)=>sum + (t.amount || 0), 0);
    const lunchSpending = transactions.filter((t)=>[
        'main course',
        'side dish'
      ].includes(t.category?.toLowerCase())).reduce((sum, t)=>sum + (t.amount || 0), 0);
    const supperSpending = transactions.filter((t)=>t.category?.toLowerCase() === 'supper').reduce((sum, t)=>sum + (t.amount || 0), 0);
    const beverageSpending = transactions.filter((t)=>t.category?.toLowerCase() === 'beverage').reduce((sum, t)=>sum + (t.amount || 0), 0);
    const dessertSpending = transactions.filter((t)=>t.category?.toLowerCase() === 'dessert').reduce((sum, t)=>sum + (t.amount || 0), 0);
    const totalSpending = transactions.reduce((sum, t)=>sum + (t.amount || 0), 0);
    // Calculate nutritional totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    transactions.forEach((t)=>{
      if (t.nutritionInfo) {
        totalCalories += t.nutritionInfo.calories || 0;
        totalProtein += t.nutritionInfo.protein || 0;
        totalCarbs += t.nutritionInfo.carbs || 0;
        totalFats += t.nutritionInfo.fats || 0;
      }
    });
    const analytics = {
      totalTransactions: transactions.length,
      totalSpending,
      breakfastSpending,
      lunchSpending,
      supperSpending,
      beverageSpending,
      dessertSpending,
      averageTransactionValue: transactions.length > 0 ? totalSpending / transactions.length : 0,
      nutritionTotals: {
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fats: totalFats
      },
      recentTransactions: transactions.slice(0, 10)
    };
    return c.json(analytics);
  } catch (error) {
    console.log(Get student analytics error: ${error});
    return c.json({
      error: "Internal server error getting analytics"
    }, 500);
  }
});
Deno.serve(app.fetch);