import { defineType, defineField } from 'sanity'

/**
 * FAQ Item schema
 * ─────────────────────────────────────────────
 * Allows the team to manage FAQ questions & answers
 * directly from the Sanity Studio.
 */
export const faqItemSchema = defineType({
    name: 'faqItem',
    title: 'FAQ Item',
    type: 'document',
    icon: () => '❓',

    preview: {
        select: { title: 'question', subtitle: 'order' },
        prepare({ title, subtitle }) {
            return { title, subtitle: `Order: ${subtitle ?? '—'}` }
        },
    },

    fields: [
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers appear first.',
            validation: (Rule) => Rule.required().integer().min(1),
        }),

        defineField({
            name: 'question',
            title: 'Question',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'answer',
            title: 'Answer',
            type: 'text',
            rows: 4,
            description: 'Plain text answer displayed in the accordion.',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'isActive',
            title: 'Show on website',
            type: 'boolean',
            initialValue: true,
        }),
    ],

    orderings: [
        {
            title: 'Display Order',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
})
