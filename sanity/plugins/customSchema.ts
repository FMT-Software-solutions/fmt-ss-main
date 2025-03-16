import { definePlugin } from 'sanity';
import { CustomPortableText } from '../components/CustomPortableText';

interface SchemaField {
  name: string;
  type: string;
  of?: Array<{ type: string }>;
  components?: {
    input: React.ComponentType<any>;
  };
  [key: string]: any;
}

interface SchemaType {
  type: string;
  fields?: SchemaField[];
  [key: string]: any;
}

export const customSchemaPlugin = definePlugin({
  name: 'custom-schema-plugin',
  schema: {
    types: (prev: SchemaType[]) => {
      return prev.map((schemaType) => {
        // Only modify document types
        if (schemaType.type !== 'document') {
          return schemaType;
        }

        // Clone the schema type to avoid mutating the original
        const newSchemaType = { ...schemaType };

        // If the schema has fields, check for description fields
        if (newSchemaType.fields) {
          newSchemaType.fields = newSchemaType.fields.map(
            (field: SchemaField) => {
              // If this is a description field with block type
              if (
                field.name === 'description' &&
                field.type === 'array' &&
                field.of &&
                field.of.some((item) => item.type === 'block')
              ) {
                // Return a modified field with our custom component
                return {
                  ...field,
                  components: {
                    input: CustomPortableText,
                  },
                };
              }
              return field;
            }
          );
        }

        return newSchemaType;
      });
    },
  },
});
