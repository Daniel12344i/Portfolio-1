import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testUploadsDirectory = async () => {
  const uploadsDir = path.join(__dirname, "uploads");
  console.log("Current directory:", __dirname);
  console.log("Uploads directory:", uploadsDir);

  // Ensure the uploads directory exists
  try {
    await fs.promises.mkdir(uploadsDir, { recursive: true });
    console.log("Uploads directory verified/created.");
  } catch (error) {
    console.error("Error creating uploads directory:", error);
    return false;
  }

  // Define test file path
  const testFile = path.join(uploadsDir, "test.txt");

  try {
    // Write a test file
    await fs.promises.writeFile(testFile, "Hello World");
    console.log("Successfully wrote test file:", testFile);

    // Read the test file
    const content = await fs.promises.readFile(testFile, "utf8");
    console.log("Successfully read test file:", content);

    // Verify file content
    if (content !== "Hello World") {
      throw new Error("Test file content mismatch!");
    }

    // Delete the test file
    await fs.promises.unlink(testFile);
    console.log("Successfully deleted test file:", testFile);

    return true;
  } catch (error) {
    console.error("Error during file operations:", error);
    return false;
  }
};

testUploadsDirectory().then((success) => {
  console.log("Test completed:", success ? "PASSED" : "FAILED");
});
