import { Hono } from "hono";
import { StatusCode } from "hono/utils/http-status";
import WriteCategory from "@/category/category.write";
import ReadCategory from "@/category/category.read";
import { category, categoryResponse, categoryResponses } from "@/category/category.type";
import { checkToken } from "@utils/auth/jwtauth";
import { checkPermisssion } from "@utils/auth/checkPermission";
import { handleError } from "@utils/error/separated";

// Create a new Hono router instance for category endpoints
const category = new Hono();

// Initialize service classes for write and read operations
const writeCategori = new WriteCategory();
const readCategory = new ReadCategory();

category
    // GET /category
    // Retrieve all categories from the database
    .get("/", async (c) => {
        try {
            const categories = await readCategory.show();

            // Build API response
            const res: categoryResponses = {
                status: 200,
                message: "success get category",
                category: categories,
            };
            
            c.status(res.status as StatusCode);
            return c.json(res);
        } catch (error) {
            throw handleError(error);
        }
    })

    // GET /category/:id
    // Retrieve a specific category with filters and pagination
    .get("/:id", async (c) => {
        try {
            // Extract query parameters
            const { page, title, oldest, populer } = c.req.query();

            // Convert id param to number
            const id = Number(c.req.param("id"));

            // Determine sorting order
            const time: "newest" | "oldest" =
                typeof oldest == "string" ? "oldest" : "newest";

            // Prepare payload for query
            let payload = {
                id: id,
                page: Number(page) || 1,
                title,
                time,
                populer: Boolean(populer),
            };

            // Fetch category data
            const category = await readCategory.find(payload);
            
            const res = {
                status: 200,
                message: "succes get category",
                ...category,
            }

            c.status(200);
            return c.json(res);
        } catch (error) {
            throw handleError(error);
        }
    })

    // USE middleware
    // check access token
    .use("/", checkToken)
    .use("/", async (c, next) => await checkPermisssion(c, next, ["admin"]))
    // POST /category
    // Create a new category
    .post("/", async (c) => {
        try {
            // Parse request body
            const request = await c.req.json();

            // Call write service to create category
            const category = await writeCategori.create(request);
            
            const res =  {
                status: 201,
                message: "success create new category",
                category: category,
            } as categoryResponse;

            c.status(res.status as StatusCode);
            return c.json(res);
        } catch (error) {
            throw handleError(error);
        }
    })

    // PUT /category
    // Update an existing category
    .put("/:id", async (c) => {
        try {
            const id = Number(c.req.param("id"));
            const request = await c.req.json();

            const category = await writeCategori.update({id,...request});

            const res =  {
                status: 200,
                message: "success update new category",
                category: category,
            } as categoryResponse;

            c.status(res.status as StatusCode);
            return c.json(res);
        } catch (error) {
            throw handleError(error);
        }
    })

    // DELETE /category/:id
    // Delete a category by its ID
    .delete("/:id", async (c) => {
        try {
            const id: number = Number(c.req.param("id"));

            // Call write service to delete category
            await writeCategori.delete(id);

            c.status(200);
            return c.json({
                status: 200,
                message: "success delete category id" + id,
            });
        } catch (error) {
            throw handleError(error);
        }
    });

export default category;
