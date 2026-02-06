//
// This file contains the Shop GraphQL resolvers
// Copy this to: /Users/pulseplay/thrico/thrico-backend/services/admin-graphql/src/schema/shop/resolvers.ts
//

import {
  shopProducts,
  shopProductMedia,
  shopProductVariants,
  shopProductOptions,
  shopBanners,
} from "@thrico/database";
import { eq, desc, and, sql } from "drizzle-orm";
import checkAuth from "../../utils/auth/checkAuth.utils";
import { GraphQLError } from "graphql";
import { logger } from "@thrico/logging";

export const shopResolvers = {
  Query: {
    // Get all shop products
    async getShopProducts(_: any, { filter, pagination }: any, context: any) {
      try {
        const { db, entity } = await checkAuth(context);

        const conditions = [eq(shopProducts.entity, entity)];

        if (filter) {
          if (filter.status) {
            conditions.push(eq(shopProducts.status, filter.status));
          }
          if (filter.category) {
            conditions.push(eq(shopProducts.category, filter.category));
          }
        }

        const limit = pagination?.limit || 50;
        const offset = pagination?.offset || 0;

        return await db.query.shopProducts.findMany({
          where: and(...conditions),
          limit,
          offset,
          orderBy: desc(shopProducts.createdAt),
          with: {
            media: true,
            variants: true,
            options: true,
          },
        });
      } catch (error: any) {
        logger.error(`Error in getShopProducts: ${error.message}`, { error });
        throw error;
      }
    },

    // Get single shop product by ID
    async getShopProduct(_: any, { id }: any, context: any) {
      try {
        const { db, entity } = await checkAuth(context);

        const product = await db.query.shopProducts.findFirst({
          where: and(eq(shopProducts.id, id), eq(shopProducts.entity, entity)),
          with: {
            media: true,
            variants: true,
            options: true,
          },
        });

        if (!product) {
          throw new GraphQLError("Product not found");
        }

        return product;
      } catch (error: any) {
        logger.error(`Error in getShopProduct: ${error.message}`, { error });
        throw error;
      }
    },

    // Get shop banners
    async getShopBanners(_: any, {}: any, context: any) {
      try {
        const { db, entity } = await checkAuth(context);

        return await db.query.shopBanners.findMany({
          where: and(
            eq(shopBanners.entity, entity),
            eq(shopBanners.isActive, true),
          ),
          orderBy: [shopBanners.sortOrder, shopBanners.createdAt],
          with: {
            linkedProduct: {
              with: {
                media: true,
              },
            },
          },
        });
      } catch (error: any) {
        logger.error(`Error in getShopBanners: ${error.message}`, { error });
        throw error;
      }
    },
  },

  Mutation: {
    // Create shop product
    async createShopProduct(_: any, { input }: any, context: any) {
      try {
        const { db, entity, userId } = await checkAuth(context);

        const payload = {
          ...input,
          entity,
          createdBy: userId,
          slug: input.slug || input.title.toLowerCase().replace(/\s+/g, "-"),
        };

        const [newProduct] = await db
          .insert(shopProducts)
          .values(payload)
          .returning();

        // Create media if provided
        if (input.media && input.media.length > 0) {
          const mediaPayload = input.media.map(
            (url: string, index: number) => ({
              productId: newProduct.id,
              url,
              sortOrder: index,
            }),
          );
          await db.insert(shopProductMedia).values(mediaPayload);
        }

        return newProduct;
      } catch (error: any) {
        logger.error(`Error in createShopProduct: ${error.message}`, { error });
        throw error;
      }
    },

    // Update shop product
    async updateShopProduct(_: any, { id, input }: any, context: any) {
      try {
        const { db, entity } = await checkAuth(context);

        const payload: any = { ...input, updatedAt: new Date() };

        const [updatedProduct] = await db
          .update(shopProducts)
          .set(payload)
          .where(and(eq(shopProducts.id, id), eq(shopProducts.entity, entity)))
          .returning();

        if (!updatedProduct) {
          throw new GraphQLError(
            "Product not found or you do not have permission to update it",
          );
        }

        return updatedProduct;
      } catch (error: any) {
        logger.error(`Error in updateShopProduct: ${error.message}`, { error });
        throw error;
      }
    },

    // Delete shop product
    async deleteShopProduct(_: any, { id }: any, context: any) {
      try {
        const { db, entity } = await checkAuth(context);

        const [deletedProduct] = await db
          .update(shopProducts)
          .set({ status: "ARCHIVED" })
          .where(and(eq(shopProducts.id, id), eq(shopProducts.entity, entity)))
          .returning();

        if (!deletedProduct) {
          throw new GraphQLError(
            "Product not found or you do not have permission to delete it",
          );
        }

        return true;
      } catch (error: any) {
        logger.error(`Error in deleteShopProduct: ${error.message}`, { error });
        throw error;
      }
    },

    // Create product variant
    async createShopProductVariant(_: any, { input }: any, context: any) {
      try {
        const { db, entity } = await checkAuth(context);

        const payload = {
          ...input,
          entity,
        };

        const [newVariant] = await db
          .insert(shopProductVariants)
          .values(payload)
          .returning();

        return newVariant;
      } catch (error: any) {
        logger.error(`Error in createShopProductVariant: ${error.message}`, {
          error,
        });
        throw error;
      }
    },

    // Update product variant
    async updateShopProductVariant(_: any, { id, input }: any, context: any) {
      try {
        const { db, entity } = await checkAuth(context);

        const payload: any = { ...input, updatedAt: new Date() };

        const [updatedVariant] = await db
          .update(shopProductVariants)
          .set(payload)
          .where(
            and(
              eq(shopProductVariants.id, id),
              eq(shopProductVariants.entity, entity),
            ),
          )
          .returning();

        if (!updatedVariant) {
          throw new GraphQLError(
            "Variant not found or you do not have permission to update it",
          );
        }

        return updatedVariant;
      } catch (error: any) {
        logger.error(`Error in updateShopProductVariant: ${error.message}`, {
          error,
        });
        throw error;
      }
    },

    // Delete product variant
    async deleteShopProductVariant(_: any, { id }: any, context: any) {
      try {
        const { db, entity } = await checkAuth(context);

        const [deletedVariant] = await db
          .delete(shopProductVariants)
          .where(
            and(
              eq(shopProductVariants.id, id),
              eq(shopProductVariants.entity, entity),
            ),
          )
          .returning();

        if (!deletedVariant) {
          throw new GraphQLError(
            "Variant not found or you do not have permission to delete it",
          );
        }

        return true;
      } catch (error: any) {
        logger.error(`Error in deleteShopProductVariant: ${error.message}`, {
          error,
        });
        throw error;
      }
    },

    // Create shop banner
    async createShopBanner(_: any, { input }: any, context: any) {
      try {
        const { db, entity, userId } = await checkAuth(context);

        const payload = {
          ...input,
          entity,
          createdBy: userId,
        };

        const [newBanner] = await db
          .insert(shopBanners)
          .values(payload)
          .returning();

        return newBanner;
      } catch (error: any) {
        logger.error(`Error in createShopBanner: ${error.message}`, { error });
        throw error;
      }
    },

    // Update shop banner
    async updateShopBanner(_: any, { id, input }: any, context: any) {
      try {
        const { db, entity } = await checkAuth(context);

        const payload: any = { ...input, updatedAt: new Date() };

        const [updatedBanner] = await db
          .update(shopBanners)
          .set(payload)
          .where(and(eq(shopBanners.id, id), eq(shopBanners.entity, entity)))
          .returning();

        if (!updatedBanner) {
          throw new GraphQLError(
            "Banner not found or you do not have permission to update it",
          );
        }

        return updatedBanner;
      } catch (error: any) {
        logger.error(`Error in updateShopBanner: ${error.message}`, { error });
        throw error;
      }
    },

    // Delete shop banner
    async deleteShopBanner(_: any, { id }: any, context: any) {
      try {
        const { db, entity } = await checkAuth(context);

        const [deletedBanner] = await db
          .delete(shopBanners)
          .where(and(eq(shopBanners.id, id), eq(shopBanners.entity, entity)))
          .returning();

        if (!deletedBanner) {
          throw new GraphQLError(
            "Banner not found or you do not have permission to delete it",
          );
        }

        return true;
      } catch (error: any) {
        logger.error(`Error in deleteShop Banner: ${error.message}`, { error });
        throw error;
      }
    },

    // Reorder banners
    async reorderShopBanners(_: any, { bannerOrders }: any, context: any) {
      try {
        const { db, entity } = await checkAuth(context);

        const updatedBanners = [];
        for (const { id, sortOrder } of bannerOrders) {
          const [updatedBanner] = await db
            .update(shopBanners)
            .set({ sortOrder, updatedAt: new Date() })
            .where(and(eq(shopBanners.id, id), eq(shopBanners.entity, entity)))
            .returning();

          if (!updatedBanner) {
            throw new GraphQLError(
              `Banner with id ${id} not found or you do not have permission to update it.`,
            );
          }

          updatedBanners.push(updatedBanner);
        }

        return updatedBanners;
      } catch (error: any) {
        logger.error(`Error in reorderShopBanners: ${error.message}`, {
          error,
        });
        throw error;
      }
    },
  },
};
