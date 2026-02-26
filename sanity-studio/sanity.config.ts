import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
    // ⚠️  Replace these with your own project ID and dataset from https://sanity.io/manage
    projectId: 'YOUR_PROJECT_ID',
    dataset: 'production',

    name: 'routiq-studio',
    title: 'Routiq CMS',

    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Routiq Content')
                    .items([
                        S.listItem()
                            .title('📦 Releases')
                            .child(
                                S.documentList()
                                    .title('All Releases')
                                    .filter('_type == "release"')
                                    .defaultOrdering([{ field: 'releaseDate', direction: 'desc' }])
                            ),
                        S.divider(),
                        S.listItem()
                            .title('❓ FAQ Items')
                            .child(
                                S.documentList()
                                    .title('All FAQ Items')
                                    .filter('_type == "faqItem"')
                                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                            ),
                    ]),
        }),
        visionTool(),
    ],

    schema: {
        types: schemaTypes,
    },
})
