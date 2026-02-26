import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Release document schema
 * ─────────────────────────────────────────────
 * Each release represents one version of the app.
 * Editors can upload APKs, iOS builds, source ZIPs,
 * write rich changelog entries, and toggle which
 * version is the "latest" one.
 */
export const releaseSchema = defineType({
    name: 'release',
    title: 'Release',
    type: 'document',
    icon: () => '📦',

    // Preview in the Studio list
    preview: {
        select: {
            title: 'version',
            subtitle: 'releaseName',
            media: 'icon',
        },
        prepare({ title, subtitle }) {
            return { title, subtitle: subtitle ?? 'No release name set' }
        },
    },

    fields: [
        // ── Meta ───────────────────────────────────────
        defineField({
            name: 'version',
            title: 'Version Number',
            type: 'string',
            description: 'e.g. v1.3.0',
            validation: (Rule) => Rule.required().regex(/^v\d+\.\d+\.\d+$/, {
                name: 'semver',
                invert: false,
            }).error('Must be in format v1.2.3'),
        }),

        defineField({
            name: 'releaseName',
            title: 'Release Name',
            type: 'string',
            description: 'e.g. "The Gamification Update"',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'releaseDate',
            title: 'Release Date',
            type: 'date',
            options: { dateFormat: 'MMMM DD, YYYY' },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'isLatest',
            title: 'Mark as Latest Release',
            type: 'boolean',
            description: 'Only one release should be marked as latest at a time.',
            initialValue: false,
        }),

        defineField({
            name: 'colorTheme',
            title: 'Card Colour Theme',
            type: 'string',
            description: 'Controls the gradient colour on the card header icon.',
            options: {
                list: [
                    { title: '🟣 Purple (brand)', value: 'purple' },
                    { title: '🔵 Blue', value: 'blue' },
                    { title: '🟢 Emerald', value: 'emerald' },
                    { title: '🟡 Amber (initial launch)', value: 'amber' },
                ],
                layout: 'radio',
            },
            initialValue: 'purple',
        }),

        defineField({
            name: 'emoji',
            title: 'Card Icon Emoji',
            type: 'string',
            description: 'A single emoji shown on the card header, e.g. 🎮 🎯 📱 🌟',
            validation: (Rule) => Rule.max(2),
            initialValue: '📦',
        }),

        defineField({
            name: 'description',
            title: 'Release Summary',
            type: 'text',
            rows: 3,
            description: 'Short paragraph describing what this release is about.',
            validation: (Rule) => Rule.required().max(300),
        }),

        // ── Changelog ──────────────────────────────────
        defineField({
            name: 'changelog',
            title: 'Changelog Items',
            type: 'array',
            description: 'Add individual changes. Use the tag to categorise each item.',
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'changelogItem',
                    title: 'Changelog Item',
                    preview: {
                        select: { title: 'featureTitle', subtitle: 'tag' },
                        prepare({ title, subtitle }) {
                            const icons: Record<string, string> = {
                                new: '✨', fix: '🐛', improvement: '🔧', performance: '⚡', breaking: '⚠️',
                            }
                            return { title, subtitle: `${icons[subtitle] ?? ''} ${subtitle?.toUpperCase() ?? ''}` }
                        },
                    },
                    fields: [
                        defineField({
                            name: 'tag',
                            title: 'Tag',
                            type: 'string',
                            options: {
                                list: [
                                    { title: '✨ New Feature', value: 'new' },
                                    { title: '🐛 Bug Fix', value: 'fix' },
                                    { title: '🔧 Improvement', value: 'improvement' },
                                    { title: '⚡ Performance', value: 'performance' },
                                    { title: '⚠️ Breaking Change', value: 'breaking' },
                                ],
                                layout: 'dropdown',
                            },
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'featureTitle',
                            title: 'Feature / Fix Title',
                            type: 'string',
                            description: 'Bold heading, e.g. "Identity Page"',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'detail',
                            title: 'Detail',
                            type: 'text',
                            rows: 2,
                            description: 'Full sentence describing the change.',
                            validation: (Rule) => Rule.required(),
                        }),
                    ],
                }),
            ],
            validation: (Rule) => Rule.required().min(1),
        }),

        // ── Downloads ─────────────────────────────────
        defineField({
            name: 'apkFile',
            title: 'Android APK File',
            type: 'file',
            description: 'Upload the .apk file for this release. Accepted: .apk',
            options: {
                accept: '.apk',
                storeOriginalFilename: true,
            },
        }),

        defineField({
            name: 'iosFile',
            title: 'iOS Build File',
            type: 'file',
            description: 'Upload the .ipa file for TestFlight distribution.',
            options: {
                accept: '.ipa',
                storeOriginalFilename: true,
            },
        }),

        defineField({
            name: 'sourceZip',
            title: 'Source Code (ZIP)',
            type: 'file',
            description: 'Optional: upload a source code archive.',
            options: {
                accept: '.zip,.tar.gz',
                storeOriginalFilename: true,
            },
        }),

        defineField({
            name: 'githubUrl',
            title: 'GitHub Release URL',
            type: 'url',
            description: 'Link to the GitHub release page (optional, used as fallback for Source button).',
            validation: (Rule) => Rule.uri({ scheme: ['https'] }),
        }),

        // ── Notes ─────────────────────────────────────
        defineField({
            name: 'internalNotes',
            title: 'Internal Notes (not shown publicly)',
            type: 'text',
            rows: 2,
            description: 'Notes for the team — not rendered on the website.',
        }),
    ],

    orderings: [
        {
            title: 'Release Date — New first',
            name: 'releaseDateDesc',
            by: [{ field: 'releaseDate', direction: 'desc' }],
        },
    ],
})
