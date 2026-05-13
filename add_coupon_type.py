import sys

# 1. DB Schema
f1 = '/Users/pulseplay/thrico/thrico-backend/packages/database/src/postgres/schema/user/rewards.ts'
with open(f1, 'r') as f: c1 = f.read()
c1 = c1.replace('  couponCode: varchar("coupon_code", { length: 255 }),', '  couponCode: varchar("coupon_code", { length: 255 }),\n  couponType: varchar("coupon_type", { length: 50 }).default("ONE_TO_ONE").notNull(),')
with open(f1, 'w') as f: f.write(c1)

# 2. Backend GraphQL Types
f2 = '/Users/pulseplay/thrico/thrico-backend/services/admin-graphql/src/schema/rewards/types.ts'
with open(f2, 'r') as f: c2 = f.read()
c2 = c2.replace('      couponCode: String\n      tcCost: Int!', '      couponType: String\n      couponCode: String\n      tcCost: Int!')
c2 = c2.replace('      couponCode: String\n      tcCost: Int', '      couponType: String\n      couponCode: String\n      tcCost: Int')
with open(f2, 'w') as f: f.write(c2)

# 3. Backend Resolvers
f3 = '/Users/pulseplay/thrico/thrico-backend/services/admin-graphql/src/schema/rewards/resolvers.ts'
with open(f3, 'r') as f: c3 = f.read()
c3 = c3.replace('          couponCode: rewards.couponCode,\n          tcCost: rewards.tcCost,', '          couponType: rewards.couponType,\n          couponCode: rewards.couponCode,\n          tcCost: rewards.tcCost,')
with open(f3, 'w') as f: f.write(c3)

# 4. Frontend Queries
f4 = '/Users/pulseplay/thrico/thrico-entity-dashboard/graphql/quries/rewards/rewards-queries.ts'
with open(f4, 'r') as f: c4 = f.read()
c4 = c4.replace('      couponCode\n      expiryDate', '      couponType\n      couponCode\n      expiryDate')
with open(f4, 'w') as f: f.write(c4)

# 5. Frontend Types
f5 = '/Users/pulseplay/thrico/thrico-entity-dashboard/components/rewards/coupons/types.ts'
with open(f5, 'r') as f: c5 = f.read()
c5 = c5.replace('  couponCode: Yup.string().nullable(),', '  couponType: Yup.string().oneOf(["ONE_TO_ONE", "ONE_TO_MANY"]).default("ONE_TO_ONE"),\n  couponCode: Yup.string().nullable(),')
with open(f5, 'w') as f: f.write(c5)

# 6. Frontend Create Page
f6 = '/Users/pulseplay/thrico/thrico-entity-dashboard/app/(authlayout)/rewards/coupons/create/page.tsx'
with open(f6, 'r') as f: c6 = f.read()
c6 = c6.replace('      couponCode: "",', '      couponType: "ONE_TO_ONE",\n      couponCode: "",')
c6 = c6.replace('          couponCode: values.couponCode,', '          couponType: values.couponType,\n          couponCode: values.couponCode,')
with open(f6, 'w') as f: f.write(c6)

# 7. Frontend Edit Page
f7 = '/Users/pulseplay/thrico/thrico-entity-dashboard/app/(authlayout)/rewards/coupons/edit/[id]/page.tsx'
with open(f7, 'r') as f: c7 = f.read()
c7 = c7.replace('      couponCode: initialData?.couponCode || "",', '      couponType: initialData?.couponType || "ONE_TO_ONE",\n      couponCode: initialData?.couponCode || "",')
c7 = c7.replace('          couponCode: values.couponCode,', '          couponType: values.couponType,\n          couponCode: values.couponCode,')
with open(f7, 'w') as f: f.write(c7)

# 8. Frontend Form Sections
f8 = '/Users/pulseplay/thrico/thrico-entity-dashboard/components/rewards/coupons/form/reward-form-sections.tsx'
with open(f8, 'r') as f: c8 = f.read()
c8 = c8.replace('                  value={formik.values.inventoryRequired ? "ONE_TO_ONE" : "ONE_TO_MANY"}\n                  onValueChange={(v) => {\n                    formik.setFieldValue("inventoryRequired", v === "ONE_TO_ONE");', '                  value={formik.values.couponType}\n                  onValueChange={(v) => {\n                    formik.setFieldValue("couponType", v);\n                    formik.setFieldValue("inventoryRequired", v === "ONE_TO_ONE");')
c8 = c8.replace('            {!formik.values.inventoryRequired && (', '            {formik.values.couponType === "ONE_TO_MANY" && (')
c8 = c8.replace('                          formik.setFieldValue("inventoryRequired", false);\n                        }\n                      }}', '                          formik.setFieldValue("couponType", "ONE_TO_MANY");\n                          formik.setFieldValue("inventoryRequired", false);\n                        }\n                      }}')
c8 = c8.replace('                          if (["SPIN_WHEEL", "SCRATCH_CARD", "MATCH_AND_WIN"].includes(mech.id)) {\n                            formik.setFieldValue("inventoryRequired", false);\n                          }\n                        }\n                      }}', '                          if (["SPIN_WHEEL", "SCRATCH_CARD", "MATCH_AND_WIN"].includes(mech.id)) {\n                            formik.setFieldValue("couponType", "ONE_TO_MANY");\n                            formik.setFieldValue("inventoryRequired", false);\n                          }\n                        }\n                      }}')
with open(f8, 'w') as f: f.write(c8)

print("Updates complete.")
