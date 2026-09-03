import { STARTER_TEMPLATES } from "@/lib/email-templates";

export const UNLAYER_MERGE_TAGS = {
  first_name: {
    name: "First Name",
    value: "{{first_name}}",
    sample: "Alex",
  },
  last_name: {
    name: "Last Name",
    value: "{{last_name}}",
    sample: "Morgan",
  },
  name: {
    name: "Full Name",
    value: "{{name}}",
    sample: "Alex Morgan",
  },
  email: {
    name: "Recipient Email",
    value: "{{email}}",
    sample: "alex@example.com",
  },
  entity_name: {
    name: "Community / Workspace Name",
    value: "{{entity_name}}",
    sample: "Thrico Community",
  },
  unsubscribe_url: {
    name: "Unsubscribe Link",
    value: "{{unsubscribe_url}}",
    sample: "https://thrico.network/unsubscribe",
  },
};

/**
 * Checks if a given JSON data is already in Unlayer design format.
 */
export function isUnlayerDesign(jsonObj: any): boolean {
  if (!jsonObj || typeof jsonObj !== "object" || Array.isArray(jsonObj)) {
    return false;
  }
  return Boolean(jsonObj.body && (Array.isArray(jsonObj.body.rows) || jsonObj.body.values));
}

/**
 * Converts legacy block-based templates or starter blocks to Unlayer design JSON format.
 */
export function convertBlocksToUnlayerDesign(
  rawBlocks: any,
  options?: { entityLogoUrl?: string; brandColor?: string }
): any {
  // If already unlayer format
  if (isUnlayerDesign(rawBlocks)) {
    return rawBlocks;
  }

  let blocks: any[] = [];
  if (typeof rawBlocks === "string") {
    try {
      const parsed = JSON.parse(rawBlocks);
      if (isUnlayerDesign(parsed)) {
        return parsed;
      }
      if (Array.isArray(parsed)) {
        blocks = parsed;
      }
    } catch {
      blocks = [];
    }
  } else if (Array.isArray(rawBlocks)) {
    blocks = rawBlocks;
  }

  const rows: any[] = [];
  let contentCounter = 1;

  for (const block of blocks) {
    const colContents: any[] = [];

    switch (block.type) {
      case "header": {
        const logo =
          block.logoUrl ||
          options?.entityLogoUrl ||
          "https://cdn.thrico.network/thrico.png";
        colContents.push({
          id: `content_${contentCounter++}`,
          type: "image",
          values: {
            src: { url: logo, width: 140, height: 40 },
            textAlign: block.align || "center",
            altText: "Logo",
            containerPadding: "24px 16px 12px 16px",
          },
        });
        if (block.secondaryContent) {
          colContents.push({
            id: `content_${contentCounter++}`,
            type: "text",
            values: {
              text: `<p style="text-align: ${block.align || "center"}; color: #64748b; font-size: 13px; font-weight: 500; margin: 0;">${block.secondaryContent}</p>`,
              textAlign: block.align || "center",
              containerPadding: "0px 16px 16px 16px",
            },
          });
        }
        break;
      }

      case "heading": {
        colContents.push({
          id: `content_${contentCounter++}`,
          type: "heading",
          values: {
            text: block.content || "Heading",
            headingType: "h1",
            fontSize: `${block.fontSize || 28}px`,
            textAlign: block.align || "center",
            color: block.color && block.color !== "transparent" ? block.color : "#0f172a",
            containerPadding: "16px 24px 8px 24px",
          },
        });
        break;
      }

      case "text": {
        const formatted = (block.content || "")
          .split("\n")
          .map((line: string) => `<p style="margin: 0 0 12px 0; line-height: 1.6;">${line || "&nbsp;"}</p>`)
          .join("");

        colContents.push({
          id: `content_${contentCounter++}`,
          type: "text",
          values: {
            text: `<div style="text-align: ${block.align || "left"}; color: ${
              block.color && block.color !== "transparent" ? block.color : "#334155"
            }; font-size: ${block.fontSize || 15}px;">${formatted}</div>`,
            textAlign: block.align || "left",
            containerPadding: "12px 24px",
          },
        });
        break;
      }

      case "button": {
        colContents.push({
          id: `content_${contentCounter++}`,
          type: "button",
          values: {
            text: block.content || "Click Here",
            href: { values: { href: block.href || "#", target: "_blank" } },
            buttonColors: {
              color: block.color || "#ffffff",
              backgroundColor:
                block.bgColor && block.bgColor !== "transparent"
                  ? block.bgColor
                  : options?.brandColor || "#4f46e5",
            },
            textAlign: block.align || "center",
            fontSize: `${block.fontSize || 14}px`,
            borderRadius: "8px",
            padding: "12px 28px",
            containerPadding: "16px 24px",
          },
        });
        break;
      }

      case "image": {
        if (block.content) {
          colContents.push({
            id: `content_${contentCounter++}`,
            type: "image",
            values: {
              src: { url: block.content, width: 560, height: 280 },
              altText: block.imageAlt || "Campaign image",
              textAlign: block.align || "center",
              href: block.href ? { values: { href: block.href, target: "_blank" } } : undefined,
              containerPadding: "16px 24px",
            },
          });
        }
        break;
      }

      case "divider": {
        colContents.push({
          id: `content_${contentCounter++}`,
          type: "divider",
          values: {
            width: "100%",
            border: {
              borderTopWidth: "1px",
              borderTopStyle: "solid",
              borderTopColor: "#e2e8f0",
            },
            containerPadding: "16px 24px",
          },
        });
        break;
      }

      case "spacer": {
        const height =
          block.spacerSize === "sm"
            ? 16
            : block.spacerSize === "lg"
            ? 48
            : block.spacerSize === "xl"
            ? 64
            : 32;

        colContents.push({
          id: `content_${contentCounter++}`,
          type: "divider",
          values: {
            width: "100%",
            border: {
              borderTopWidth: "0px",
              borderTopStyle: "none",
              borderTopColor: "transparent",
            },
            containerPadding: `${Math.round(height / 2)}px 0`,
          },
        });
        break;
      }

      case "navbar": {
        try {
          const links =
            typeof block.content === "string" ? JSON.parse(block.content) : block.content;
          if (Array.isArray(links)) {
            const htmlLinks = links
              .map(
                (l: any) =>
                  `<a href="${l.url || "#"}" style="margin: 0 14px; color: #475569; font-size: 13px; font-weight: 600; text-decoration: none;">${
                    l.label || ""
                  }</a>`
              )
              .join("");
            colContents.push({
              id: `content_${contentCounter++}`,
              type: "text",
              values: {
                text: `<div style="text-align: center; padding: 8px 0;">${htmlLinks}</div>`,
                textAlign: "center",
                containerPadding: "12px 24px",
              },
            });
          }
        } catch {
          // ignore
        }
        break;
      }

      case "footer": {
        colContents.push({
          id: `content_${contentCounter++}`,
          type: "text",
          values: {
            text: `<p style="text-align: ${
              block.align || "center"
            }; font-size: 11px; color: #94a3b8; line-height: 1.5; margin: 0 0 10px 0;">${
              block.content || "© 2026 Thrico. All rights reserved."
            }</p><p style="text-align: ${
              block.align || "center"
            }; font-size: 10px; margin: 0;"><a href="{{unsubscribe_url}}" style="color: #6366f1; text-decoration: underline;">Unsubscribe</a> &nbsp;•&nbsp; <a href="#" style="color: #94a3b8; text-decoration: none;">Manage Preferences</a></p>`,
            textAlign: block.align || "center",
            containerPadding: "24px 24px 32px 24px",
          },
        });
        break;
      }

      default:
        break;
    }

    if (colContents.length > 0) {
      rows.push({
        id: `row_${rows.length + 1}`,
        cells: [1],
        columns: [
          {
            id: `col_${rows.length + 1}_1`,
            contents: colContents,
            values: {},
          },
        ],
        values: {
          backgroundColor: "#ffffff",
          padding: "0px",
        },
      });
    }
  }

  return {
    counters: {
      u_row: rows.length + 1,
      u_column: rows.length + 1,
      u_content_text: contentCounter,
      u_content_heading: contentCounter,
      u_content_button: contentCounter,
      u_content_image: contentCounter,
      u_content_divider: contentCounter,
    },
    body: {
      id: "root-body",
      rows:
        rows.length > 0
          ? rows
          : [
              {
                id: "row_1",
                cells: [1],
                columns: [
                  {
                    id: "col_1",
                    contents: [
                      {
                        id: "content_1",
                        type: "heading",
                        values: {
                          text: "Design Your Campaign",
                          headingType: "h1",
                          fontSize: "26px",
                          textAlign: "center",
                          color: "#0f172a",
                          containerPadding: "36px 20px 12px 20px",
                        },
                      },
                      {
                        id: "content_2",
                        type: "text",
                        values: {
                          text: '<p style="text-align: center; color: #64748b; font-size: 14px; margin: 0;">Drag components from the right sidebar to start crafting your email message.</p>',
                          textAlign: "center",
                          containerPadding: "0px 20px 32px 20px",
                        },
                      },
                    ],
                    values: {},
                  },
                ],
                values: {
                  backgroundColor: "#ffffff",
                  padding: "0px",
                },
              },
            ],
      values: {
        backgroundColor: "#f8fafc",
        contentWidth: "600px",
        fontFamily: {
          label: "Inter",
          value: "'Inter',sans-serif",
        },
      },
    },
  };
}
