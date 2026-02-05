-- Insert sample user
INSERT INTO "User" ("id", "email", "name", "role", "createdAt", "updatedAt") 
VALUES ('demo-user-id', 'demo@example.com', 'Demo User', 'ME', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;

-- Insert sample daily trackers
INSERT INTO "daily_trackers" ("id", "date", "day", "deepWorkDone", "gymDone", "contentDone", "ecommerceDone", "printerDone", "sleepBefore11", "wake530", "mood", "notes", "score", "userId", "createdAt", "updatedAt")
VALUES 
    ('tracker-1', '2024-02-05', 'Monday', true, true, false, true, false, true, true, 'GREAT', 'Productive day!', 6, 'demo-user-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tracker-2', '2024-02-04', 'Sunday', false, true, true, false, true, false, false, 'GOOD', 'Relaxed weekend', 4, 'demo-user-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert sample tasks
INSERT INTO "tasks" ("id", "title", "description", "category", "priority", "status", "dueDate", "estimatedTime", "owner", "userId", "createdAt", "updatedAt")
VALUES 
    ('task-1', 'Complete Next.js tutorial video', 'Finish recording and editing the tutorial', 'YOUTUBE', 'HIGH', 'TODAY', '2024-02-08', 'HOUR2', 'ME', 'demo-user-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('task-2', 'Design new t-shirt graphics', 'Create designs for the summer collection', 'ECOMMERCE', 'MEDIUM', 'IN_PROGRESS', '2024-02-10', 'HOUR4', 'WIFE', 'demo-user-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('task-3', '3D print customer order', 'Print and prepare the custom figurine', 'PRINTER', 'HIGH', 'TODAY', '2024-02-08', 'HOUR2', 'ME', 'demo-user-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert sample content
INSERT INTO "content" ("id", "title", "platforms", "type", "status", "shootDate", "publishDate", "owner", "remarks", "userId", "createdAt", "updatedAt")
VALUES 
    ('content-1', 'Next.js 14 App Router Tutorial', ARRAY['BODHI_TECH_TALKS', 'SHORTS'], 'LONG_VIDEO', 'EDITING', '2024-02-06', '2024-02-10', 'ME', 'Need to add thumbnail', 'demo-user-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('content-2', 'Prisma Performance Tips', ARRAY['BODHI_LEARN'], 'SHORT', 'SCRIPTED', '2024-02-08', '2024-02-12', 'WIFE', 'Research complete', 'demo-user-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert sample business orders
INSERT INTO "business" ("id", "customerName", "businessType", "orderStatus", "orderDate", "deliveryDate", "amount", "cost", "profit", "paymentStatus", "handledBy", "notes", "userId", "createdAt", "updatedAt")
VALUES 
    ('business-1', 'John Doe', 'CLOTHING', 'DELIVERED', '2024-02-01', '2024-02-05', 2500, 1200, 1300, 'PAID', 'ME', 'Custom t-shirt order', 'demo-user-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('business-2', 'Jane Smith', 'PRINTING_3D', 'PRINTING', '2024-02-08', NULL, 800, 200, 600, 'PENDING', 'WIFE', 'Custom figurine design', 'demo-user-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('business-3', 'Bob Johnson', 'CLOTHING', 'NEW', '2024-02-10', NULL, 1500, 600, 900, 'PAID', 'ME', 'Hoodie bulk order', 'demo-user-id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
