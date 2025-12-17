"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ImageUpload } from "./image-upload"

const CATEGORIES = [
  "Electronics & Appliances",
  "Vehicles",
  "Real Estate",
  "Home & Furniture",
  "Fashion & Beauty",
  "Sports, Hobbies & Books",
  "Pets",
  "Services",
]

const CONDITIONS = [
  { value: "NEW", label: "New", description: "Brand new, unused item" },
  { value: "USED_LIKE_NEW", label: "Like New", description: "No visible wear" },
  { value: "USED_LIKE_GOOD", label: "Good", description: "Minor signs of wear" },
  { value: "USED_LIKE_FAIR", label: "Fair", description: "Noticeable wear" },
]

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  description: Yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  price: Yup.number().required("Price is required").min(0, "Price must be greater than 0"),
  location: Yup.string().required("Location is required"),
  category: Yup.string().required("Category is required"),
  condition: Yup.string().required("Condition is required"),
  media: Yup.array().min(1, "At least one photo is required"),
})

export function ListingCreationForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const initialValues = {
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "NEW",
    location: "",
    media: [],
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSubmit(values)
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Photos</Label>
              <p className="text-sm text-muted-foreground mb-3">Upload up to 4 photos</p>
              <ImageUpload fileList={values.media} onFilesChange={(files) => setFieldValue("media", files)} />
              <ErrorMessage name="media">
                {(msg) => <p className="text-xs text-destructive mt-1">{msg}</p>}
              </ErrorMessage>
            </div>

            <FormField name="title" label="Listing Title *" />

            <FormField
              name="description"
              label="Description *"
              as="textarea"
              placeholder="Describe your item in detail..."
              className="min-h-[100px]"
              help="At least 10 characters"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField name="price" label="Price (₹) *" type="number" placeholder="0" />
              <FormField name="location" label="Location *" placeholder="e.g., Delhi, India" />
            </div>

            <CategorySelect value={values.category} setFieldValue={setFieldValue} />

            <ConditionRadio value={values.condition} setFieldValue={setFieldValue} />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Next: Preview
          </Button>
        </Form>
      )}
    </Formik>
  )
}

function FormField({
  name,
  label,
  as = "input",
  type = "text",
  placeholder = "",
  help = "",
  className = "",
}: {
  name: string
  label: string
  as?: string
  type?: string
  placeholder?: string
  help?: string
  className?: string
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Field name={name}>
        {({ field }: any) =>
          as === "textarea" ? (
            <Textarea {...field} id={name} placeholder={placeholder} className={`mt-2 ${className}`} />
          ) : (
            <Input {...field} id={name} type={type} placeholder={placeholder} className="mt-2" />
          )
        }
      </Field>
      <ErrorMessage name={name}>{(msg) => <p className="text-xs text-destructive mt-1">{msg}</p>}</ErrorMessage>
      {help && <p className="text-xs text-muted-foreground mt-1">{help}</p>}
    </div>
  )
}

function CategorySelect({
  value,
  setFieldValue,
}: {
  value: string
  setFieldValue: (field: string, value: any) => void
}) {
  return (
    <div>
      <Label htmlFor="category">Category *</Label>
      <Select value={value} onValueChange={(val) => setFieldValue("category", val)}>
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ErrorMessage name="category">{(msg) => <p className="text-xs text-destructive mt-1">{msg}</p>}</ErrorMessage>
    </div>
  )
}

function ConditionRadio({
  value,
  setFieldValue,
}: {
  value: string
  setFieldValue: (field: string, value: any) => void
}) {
  return (
    <div>
      <Label className="mb-3 block">Condition *</Label>
      <RadioGroup value={value} onValueChange={(val) => setFieldValue("condition", val)}>
        <div className="space-y-3">
          {CONDITIONS.map((condition) => (
            <div key={condition.value} className="flex items-center space-x-2">
              <RadioGroupItem value={condition.value} id={condition.value} />
              <Label htmlFor={condition.value} className="flex-1 cursor-pointer">
                <span className="font-medium">{condition.label}</span>
                <p className="text-xs text-muted-foreground">{condition.description}</p>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
      <ErrorMessage name="condition">{(msg) => <p className="text-xs text-destructive mt-1">{msg}</p>}</ErrorMessage>
    </div>
  )
}
