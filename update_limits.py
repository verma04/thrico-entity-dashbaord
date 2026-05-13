import sys

filename = '/Users/pulseplay/thrico/thrico-entity-dashboard/components/rewards/coupons/form/reward-form-sections.tsx'
with open(filename, 'r') as f:
    content = f.read()

# 1. Update "Select All"
content = content.replace(
    'formik.setFieldValue("couponType", "ONE_TO_MANY");\n                          formik.setFieldValue("inventoryRequired", false);\n                        }\n                      }}',
    'formik.setFieldValue("couponType", "ONE_TO_MANY");\n                          formik.setFieldValue("inventoryRequired", false);\n                          formik.setFieldValue("totalUsageLimit", 0);\n                          formik.setFieldValue("perUserLimit", 0);\n                        }\n                      }}'
)

# 2. Update individual button
content = content.replace(
    'formik.setFieldValue("couponType", "ONE_TO_MANY");\n                            formik.setFieldValue("inventoryRequired", false);\n                          }\n                        }\n                      }}',
    'formik.setFieldValue("couponType", "ONE_TO_MANY");\n                            formik.setFieldValue("inventoryRequired", false);\n                            formik.setFieldValue("totalUsageLimit", 0);\n                            formik.setFieldValue("perUserLimit", 0);\n                          }\n                        }\n                      }}'
)

# 3. Update Inputs
disabled_check = '''disabled={(() => {
                  const selected = Array.isArray(formik.values.rewardMechanism)
                    ? formik.values.rewardMechanism
                    : formik.values.rewardMechanism
                      ? [formik.values.rewardMechanism]
                      : [];
                  return selected.some((m: string) => ["SPIN_WHEEL", "SCRATCH_CARD", "MATCH_AND_WIN"].includes(m));
                })()}'''

content = content.replace(
    '                placeholder="0 = Unlimited"\n                className="bg-white dark:bg-muted/10 border-border/40"\n                {...formik.getFieldProps("totalUsageLimit")}',
    f'                placeholder="0 = Unlimited"\n                {disabled_check}\n                className="bg-white dark:bg-muted/10 border-border/40 disabled:opacity-50"\n                {{...formik.getFieldProps("totalUsageLimit")}}'
)

content = content.replace(
    '                id="perUserLimit"\n                type="number"\n                className="bg-white dark:bg-muted/10 border-border/40"\n                {...formik.getFieldProps("perUserLimit")}',
    f'                id="perUserLimit"\n                type="number"\n                {disabled_check}\n                className="bg-white dark:bg-muted/10 border-border/40 disabled:opacity-50"\n                {{...formik.getFieldProps("perUserLimit")}}'
)

with open(filename, 'w') as f:
    f.write(content)

print("Limits update complete")
