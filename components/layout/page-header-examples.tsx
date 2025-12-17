/**
 * Example: How to use PageHeader and CurrentUrl components
 * 
 * This file demonstrates different ways to display the current URL
 * and page metadata in your Next.js application.
 */

// Example 1: Full PageHeader with all features
import { PageHeader } from "@/components/layout/page-header";

export default function ExamplePage1() {
  return (
    <div className="container mx-auto p-6">
      {/* Shows title, URL, and description */}
      <PageHeader />
      
      <div className="mt-8">
        {/* Your page content */}
      </div>
    </div>
  );
}

// Example 2: PageHeader without description
export function ExamplePage2() {
  return (
    <div className="container mx-auto p-6">
      <PageHeader showDescription={false} />
      
      <div className="mt-8">
        {/* Your page content */}
      </div>
    </div>
  );
}

// Example 3: PageHeader without URL
export function ExamplePage3() {
  return (
    <div className="container mx-auto p-6">
      <PageHeader showUrl={false} />
      
      <div className="mt-8">
        {/* Your page content */}
      </div>
    </div>
  );
}

// Example 4: Compact CurrentUrl component
import { CurrentUrl } from "@/components/layout/page-header";

export function ExamplePage4() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Custom Title</h1>
      
      {/* Just show the current URL */}
      <CurrentUrl className="mb-6" />
      
      <div>
        {/* Your page content */}
      </div>
    </div>
  );
}

// Example 5: Custom styled PageHeader
export function ExamplePage5() {
  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        className="bg-muted/50 p-4 rounded-lg border"
      />
      
      <div className="mt-8">
        {/* Your page content */}
      </div>
    </div>
  );
}
