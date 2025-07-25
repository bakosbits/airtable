import { categoriesTable, toolsTable } from "@/lib/shared/base";

export async function getAllCategories() {

    if (!process.env.AIRTABLE_CATEGORIES_TABLE) {
        console.error(
            "CRITICAL ERROR: Missing AIRTABLE_CATEGORIES_TABLE environment variable in getAllCategories.",
        );
        throw new Error(
            "Missing AIRTABLE_CATEGORIES_TABLE environment variable",
        );
    }

    try {
        const activeTools = await toolsTable
            .select({
                filterByFormula: "{Active} = TRUE()",
                fields: ["Categories"],
            })
            .all();

        const usedCategoryIds = new Set();
        for (const tool of activeTools) {
            const categories = tool.fields["Categories"] || [];
            categories.forEach((catId) => usedCategoryIds.add(catId));
        }

        const categoryRecords = await categoriesTable
            .select({
                fields: ["Name", "Slug", "Description", "Count"],
            })
            .all();

        const filteredCategories = categoryRecords.filter((record) =>
            usedCategoryIds.has(record.id),
        );

        const mappedCategories = filteredCategories.map((record) => ({
            id: record.id,
            Name: record.fields["Name"],
            Slug: record.fields["Slug"],
            Description: record.fields["Description"] ?? null,
            Count: record.fields["Count"] ?? 0,
        }));

        return mappedCategories;
    } catch (error) {
        console.error(
            "[getAllCategories] ERROR fetching categories:",
            error.message,
            error.stack,
        );
        throw error;
    }
}