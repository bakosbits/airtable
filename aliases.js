import { aliasesTable, } from "@/lib/shared/base";

export async function getAllAliases() {
    try {
        const aliasRecords = await aliasesTable
            .select({
                fields: ["Type", "Name", "Aliases"],
            })
            .all();

        const aliases = {};
        aliasRecords.forEach((record) => {
            const type = record.fields.Type;
            const name = record.fields.Name;
            const aliasList = (record.fields.Aliases || "")
                .split(",")
                .map((a) => a.trim())
                .filter((a) => a !== "");

            if (type && name) {
                if (!aliases[type]) {
                    // Group by Type first
                    aliases[type] = {};
                }
                aliases[type][name] = aliasList; // Then map Name to its Aliases
            }
        });

        return aliases;
    } catch (error) {
        console.error(
            "[getAllAliases] ERROR fetching aliases:",
            error.message,
            error.stack,
        );
        return {};
    }
}