// Run this script with: node scripts/seed-data.js
// Make sure to set MONGODB_URI in your environment

const { MongoClient, ObjectId } = require("mongodb")
const bcrypt = require("bcryptjs")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"

async function seed() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("learning_platform")

    // Clear existing data
    await db.collection("users").deleteMany({})
    await db.collection("courses").deleteMany({})
    await db.collection("enrollments").deleteMany({})
    console.log("Cleared existing data")

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10)
    const adminResult = await db.collection("users").insertOne({
      email: "admin@example.com",
      password: adminPassword,
      fullName: "Admin User",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log("Created admin user: admin@example.com / admin123")

    // Create student user
    const studentPassword = await bcrypt.hash("student123", 10)
    const studentResult = await db.collection("users").insertOne({
      email: "student@example.com",
      password: studentPassword,
      fullName: "John Student",
      role: "student",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log("Created student user: student@example.com / student123")

    // Create sample course
    const courseResult = await db.collection("courses").insertOne({
      title: "IELTS General Training Complete Guide",
      slug: "ielts-general-training-complete-guide",
      description:
        "Master all four modules of IELTS General Training with comprehensive lessons, practice tests, and expert feedback.",
      thumbnailUrl: "/ielts-study-materials.jpg",
      createdBy: adminResult.insertedId,
      createdByName: "Admin User",
      modules: [
        {
          id: new ObjectId().toString(),
          title: "Introduction to IELTS",
          order: 1,
          lessons: [
            {
              id: new ObjectId().toString(),
              title: "What is IELTS?",
              type: "video",
              url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              order: 1,
            },
            {
              id: new ObjectId().toString(),
              title: "Test Format Overview",
              type: "pdf",
              url: "https://example.com/ielts-format.pdf",
              order: 2,
            },
          ],
          quizzes: [
            {
              id: new ObjectId().toString(),
              title: "IELTS Basics Quiz",
              questions: [
                {
                  id: new ObjectId().toString(),
                  type: "mcq",
                  question: "How many sections are there in the IELTS test?",
                  options: ["2", "3", "4", "5"],
                  correctAnswer: "4",
                  order: 1,
                },
                {
                  id: new ObjectId().toString(),
                  type: "free-text",
                  question: "Explain the difference between IELTS Academic and General Training.",
                  order: 2,
                },
              ],
            },
          ],
        },
        {
          id: new ObjectId().toString(),
          title: "Listening Skills",
          order: 2,
          lessons: [
            {
              id: new ObjectId().toString(),
              title: "Listening Strategies",
              type: "video",
              url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              order: 1,
            },
            {
              id: new ObjectId().toString(),
              title: "Practice Test 1",
              type: "audio",
              url: "https://example.com/listening-test-1.mp3",
              order: 2,
            },
          ],
          quizzes: [],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log("Created sample course")

    // Enroll student in course
    await db.collection("enrollments").insertOne({
      studentId: studentResult.insertedId,
      studentEmail: "student@example.com",
      courseId: courseResult.insertedId,
      assignedAt: new Date(),
      revoked: false,
    })
    console.log("Enrolled student in course")

    console.log("\n✅ Seed completed successfully!")
    console.log("\nTest credentials:")
    console.log("Admin: admin@example.com / admin123")
    console.log("Student: student@example.com / student123")
    console.log(
      `Superadmin: Use SUPERADMIN_PASSWORD from env (default: ${process.env.SUPERADMIN_PASSWORD || "superadmin123"})`,
    )
  } catch (error) {
    console.error("Seed error:", error)
  } finally {
    await client.close()
  }
}

seed()
