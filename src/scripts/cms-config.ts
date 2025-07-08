import type { InitOptions } from "decap-cms-core";

export const cmsConfig: InitOptions = {
	config: {
		local_backend: true,
		backend: {
			name: "git-gateway",
			branch: "decapcms",
		},
		// Add some additional configuration for better error handling
		display_url: "http://localhost:4321",
		media_folder: "public/images",
		public_folder: "/images",
		collections: [
			{
				name: "posts",
				label: "Blog Posts",
				label_singular: "Blog Post",
				folder: "src/content/blog",
				create: true,
				slug: "{{year}}-{{month}}-{{day}}-{{slug}}",
				extension: "md",
				format: "frontmatter",
				fields: [
					{
						label: "Title",
						name: "title",
						widget: "string",
						required: true,
					},
					{
						label: "Slug",
						name: "slug",
						widget: "string",
						required: true,
					},
					{
						label: "Date",
						name: "date",
						widget: "datetime",
						required: true,
					},
					{
						label: "Description",
						name: "description",
						widget: "string",
						required: false,
					},
					{
						label: "Featured Image",
						name: "image",
						widget: "image",
						required: false,
					},
					{
						label: "Tags",
						name: "tags",
						widget: "relation",
						collection: "tags",
						search_fields: ["title", "slug"],
						value_field: "slug",
						display_fields: ["title"],
						multiple: true,
					},
					{
						label: "Body",
						name: "body",
						widget: "markdown",
						required: true,
					},
				],
			},
			{
				name: "tags",
				label: "Tags",
				folder: "src/content/tags",
				create: true,
				slug: "{{slug}}",
				label_singular: "Tag",
				description: "Tags for blog posts",
				format: "json",
				editor: {
					preview: false,
				},
				fields: [
					{
						label: "Title",
						name: "title",
						widget: "string",
						required: true,
					},
					{
						label: "Slug",
						name: "slug",
						widget: "string",
						required: true,
					},
					{
						label: "Description",
						name: "description",
						widget: "string",
						required: false,
					},
					{
						label: "Color",
						name: "color",
						widget: "color",
						default: "#000000",
						required: true,
					},
				],
			},
		],
	},
};
