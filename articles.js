import { articlesTable } from "@/lib/shared/base";

export async function getAllArticles() {

    try {
        const records = await articlesTable
            .select({
                filterByFormula: "{Published} = TRUE()",
                sort: [{ field: "Date", direction: "desc" }],
            })
            .all();

        const mappedArticles = records
            .map((record) => ({
                id: record.id,
                Title: record.get("Title") || "",
                Slug: record.get("Slug") || "",
                Summary: record.get("Summary") || "",
                Content: record.get("Content") || "",
                Date: record.get("Date") || "",
                Tags: record.get("Tags") || [],
                Image: record.get("Image") || null,
                Author: record.get("Author") || "",
            }))
            .filter((record) => record.Slug); // Filter out any records without a slug

        return mappedArticles;
    } catch (error) {
        console.error(
            "[getAllArticles] ERROR fetching all articles:",
            error.message,
            error.stack,
        );
        throw error;
    }
}

export async function getArticleBySlug(Slug) {

    try {
        const records = await articlesTable
            .select({
                filterByFormula: `LOWER({Slug}) = '${Slug.toLowerCase()}'`,
                maxRecords: 1,
            })
            .firstPage();

        if (!records || records.length === 0) {
            console.warn(
                `[getArticleBySlug] Article with Slug "${Slug}" not found. Returning null.`,
            );
            return null;
        }

        const record = records[0];

        return {
            id: record.id,
            Title: record.get("Title") || "",
            Slug: record.get("Slug") || "",
            Summary: record.get("Summary") || "",
            Content: record.get("Content") || "",
            Date: record.get("Date") || "",
            Tags: record.get("Tags") || [],
            Image: record.get("Image") || null,
            Author: record.get("Author") || "",
        };
    } catch (error) {
        console.error(
            `[getArticleBySlug] ERROR fetching article by Slug "${Slug}":`,
            error.message,
            error.stack,
        );
        throw error;
    }
}
