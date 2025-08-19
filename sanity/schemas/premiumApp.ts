import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'premiumApp',
  title: 'Premium App',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this app on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      description: 'Toggle to publish/unpublish this app',
      initialValue: false,
    }),
    defineField({
      name: 'price',
      title: 'Original Price',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'promotion',
      title: 'Promotion',
      type: 'object',
      fields: [
        defineField({
          name: 'hasPromotion',
          title: 'Enable Promotion',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'discountPrice',
          title: 'Promotion Price',
          type: 'number',
          validation: (Rule) => Rule.positive(),
          hidden: ({ parent }) => !parent?.hasPromotion,
        }),
        defineField({
          name: 'startDate',
          title: 'Promotion Start Date',
          type: 'datetime',
          validation: (Rule) => Rule.custom((startDate, context) => {
            const parent = context.parent as any;
            if (!parent?.hasPromotion) return true;
            if (!startDate) return 'Start date is required when promotion is enabled';
            return true;
          }),
          hidden: ({ parent }) => !parent?.hasPromotion,
        }),
        defineField({
          name: 'endDate',
          title: 'Promotion End Date',
          type: 'datetime',
          validation: (Rule) => Rule.custom((endDate, context) => {
            const parent = context.parent as any;
            if (!parent?.hasPromotion) return true;
            if (!endDate) return 'End date is required when promotion is enabled';
            if (parent?.startDate && new Date(endDate) <= new Date(parent.startDate)) {
              return 'End date must be after start date';
            }
            return true;
          }),
          hidden: ({ parent }) => !parent?.hasPromotion,
        }),
        defineField({
          name: 'isActive',
          title: 'Promotion Active',
          type: 'boolean',
          description: 'Manually enable/disable promotion',
          initialValue: true,
          hidden: ({ parent }) => !parent?.hasPromotion,
        }),

      ],
    }),
    defineField({
      name: 'sectors',
      title: 'Sectors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'sector' }] }],
      validation: (Rule) => Rule.required().min(1),
      description: 'Select one or more sectors for this app',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Video Type',
          type: 'string',
          options: {
            list: [
              { title: 'YouTube Video', value: 'youtube' },
              { title: 'Custom Video URL', value: 'custom' },
            ],
          },
        }),
        defineField({
          name: 'url',
          title: 'Video URL',
          type: 'url',
          description: 'YouTube video URL or custom video URL',
        }),
      ],
    }),
    defineField({
      name: 'screenshots',
      title: 'Screenshots',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'systemRequirements',
      title: 'System Requirements',
      type: 'systemRequirements',
    }),
    defineField({
      name: 'platforms',
      title: 'Available Platforms',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'platform' }] }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'downloadUrl',
      title: 'Download URL',
      type: 'url',
      description: 'URL for downloading the app (if applicable)',
    }),
    defineField({
      name: 'webAppUrl',
      title: 'Web App URL',
      type: 'url',
      description: 'URL for the web version of the app (if applicable)',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      media: 'mainImage',
    },
    prepare(selection) {
      const { title, price, media } = selection;
      return {
        title,
        subtitle: `GHS${price}`,
        media,
      };
    },
  },
});
