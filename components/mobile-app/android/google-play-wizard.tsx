"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Circle, FileJson, Loader2, PlaySquare, UploadCloud, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFormik } from "formik";
import * as Yup from "yup";

export interface GooglePlayConnection {
  developerName: string;
  developerEmail: string;
  packageName: string;
  applicationName: string;
  isConnected: boolean;
  lastVerified?: string;
}

interface GooglePlayWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (connection: GooglePlayConnection) => void;
}

const validationSchema = Yup.object({
  developerName: Yup.string().required("Developer Name is required"),
  developerEmail: Yup.string().email("Invalid email format").required("Developer Email is required"),
  packageName: Yup.string()
    .matches(/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$/i, "Invalid package name format. Example: com.company.community")
    .required("Package Name is required"),
});

export function GooglePlayWizard({ open, onOpenChange, onComplete }: GooglePlayWizardProps) {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState<string | null>(null);
  
  // Verification states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyChecks, setVerifyChecks] = useState({
    readingJson: false,
    authenticating: false,
    apiEnabled: false,
    devFound: false,
    permVerified: false,
  });

  const [isCheckingApp, setIsCheckingApp] = useState(false);
  const [appFound, setAppFound] = useState<boolean | null>(null);

  const formik = useFormik({
    initialValues: {
      developerName: "",
      developerEmail: "",
      packageName: "",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: () => {}, // We handle completion manually
  });

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setStep(1);
      formik.resetForm();
      setFileName(null);
      setVerifyChecks({
        readingJson: false,
        authenticating: false,
        apiEnabled: false,
        devFound: false,
        permVerified: false,
      });
      setAppFound(null);
      setIsCheckingApp(false);
      setIsVerifying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const simulateVerification = () => {
    setIsVerifying(true);
    setVerifyChecks({
      readingJson: false,
      authenticating: false,
      apiEnabled: false,
      devFound: false,
      permVerified: false,
    });
    
    // Simulate steps sequentially
    setTimeout(() => setVerifyChecks((prev) => ({ ...prev, readingJson: true })), 1000);
    setTimeout(() => setVerifyChecks((prev) => ({ ...prev, authenticating: true })), 2000);
    setTimeout(() => setVerifyChecks((prev) => ({ ...prev, apiEnabled: true })), 3000);
    setTimeout(() => setVerifyChecks((prev) => ({ ...prev, devFound: true })), 4000);
    setTimeout(() => {
      setVerifyChecks((prev) => ({ ...prev, permVerified: true }));
      setIsVerifying(false);
    }, 5000);
  };

  const simulateAppCheck = (forceFound = false) => {
    setIsCheckingApp(true);
    setTimeout(() => {
      setIsCheckingApp(false);
      if (forceFound) {
        setAppFound(true);
      } else {
        setAppFound(false);
      }
    }, 2000);
  };

  const isStep2Valid = 
    formik.values.developerName.length > 0 && 
    formik.values.developerEmail.length > 0 && 
    !formik.errors.developerName && 
    !formik.errors.developerEmail;

  const isStep5Valid = 
    formik.values.packageName.length > 0 && 
    !formik.errors.packageName;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <PlaySquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Before connecting, make sure you have:</h3>
            </div>
            
            <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Google Play Developer Account</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Google Cloud Project</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Service Account JSON</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Google Play Developer API Enabled</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground p-4 border rounded-lg">
              <span>Estimated Time</span>
              <span className="font-medium text-foreground">10 Minutes</span>
            </div>

            <Button className="w-full" onClick={handleNext}>Continue</Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="developerName">Developer Name</Label>
                <Input 
                  id="developerName"
                  name="developerName"
                  placeholder="e.g. HDFC Bank Ltd" 
                  value={formik.values.developerName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.developerName && formik.errors.developerName ? "border-red-500" : ""}
                />
                {formik.touched.developerName && formik.errors.developerName && (
                  <p className="text-sm text-red-500">{formik.errors.developerName as string}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="developerEmail">Developer Email</Label>
                <Input 
                  id="developerEmail" 
                  name="developerEmail"
                  type="email"
                  placeholder="e.g. admin@hdfcbank.com" 
                  value={formik.values.developerEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.developerEmail && formik.errors.developerEmail ? "border-red-500" : ""}
                />
                {formik.touched.developerEmail && formik.errors.developerEmail && (
                  <p className="text-sm text-red-500">{formik.errors.developerEmail as string}</p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
              <Button 
                className="flex-1" 
                onClick={handleNext}
                disabled={!isStep2Valid}
              >
                Continue
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            {!fileName ? (
              <div className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center space-y-4 hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <UploadCloud className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Upload Google Play Service Account</p>
                  <p className="text-sm text-muted-foreground mt-1">Drag & Drop JSON or</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setFileName("mobile-publisher.json")}
                >
                  Upload JSON
                </Button>
                <p className="text-xs text-muted-foreground mt-4">Accepted Format: .json</p>
              </div>
            ) : (
              <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4 bg-primary/5 border-primary/20">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <FileJson className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-primary">Service Account Uploaded</h3>
                  <p className="text-sm text-muted-foreground mt-1">Filename: {fileName}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
              <Button 
                className="flex-1" 
                onClick={() => {
                  handleNext();
                  simulateVerification();
                }}
                disabled={!fileName}
              >
                Verify Connection
              </Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium">{isVerifying ? "Checking Connection..." : "Google Play Connected"}</h3>
            </div>
            
            <div className="space-y-4 border rounded-lg p-4">
              <div className="flex items-center gap-3">
                {verifyChecks.readingJson ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
                <span className={verifyChecks.readingJson ? "" : "text-muted-foreground"}>Reading JSON</span>
              </div>
              <div className="flex items-center gap-3">
                {verifyChecks.authenticating ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : (verifyChecks.readingJson ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : <Circle className="w-5 h-5 text-muted-foreground/30" />)}
                <span className={verifyChecks.authenticating ? "" : "text-muted-foreground"}>Authenticating</span>
              </div>
              <div className="flex items-center gap-3">
                {verifyChecks.apiEnabled ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : (verifyChecks.authenticating ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : <Circle className="w-5 h-5 text-muted-foreground/30" />)}
                <span className={verifyChecks.apiEnabled ? "" : "text-muted-foreground"}>Google Play API Enabled</span>
              </div>
              <div className="flex items-center gap-3">
                {verifyChecks.devFound ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : (verifyChecks.apiEnabled ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : <Circle className="w-5 h-5 text-muted-foreground/30" />)}
                <span className={verifyChecks.devFound ? "" : "text-muted-foreground"}>Developer Account Found</span>
              </div>
              <div className="flex items-center gap-3">
                {verifyChecks.permVerified ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : (verifyChecks.devFound ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : <Circle className="w-5 h-5 text-muted-foreground/30" />)}
                <span className={verifyChecks.permVerified ? "" : "text-muted-foreground"}>Permission Verified</span>
              </div>
            </div>

            {!isVerifying && (
              <div className="p-4 bg-green-50/50 border border-green-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-800 font-medium">Developer</p>
                  <p className="text-green-900">{formik.values.developerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-800 font-medium">Status</p>
                  <p className="text-green-600 flex items-center gap-1 justify-end"><CheckCircle2 className="w-4 h-4" /> Verified</p>
                </div>
              </div>
            )}

            <Button 
              className="w-full" 
              onClick={handleNext}
              disabled={isVerifying}
            >
              Continue →
            </Button>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="packageName">Package Name</Label>
                <Input 
                  id="packageName" 
                  name="packageName"
                  placeholder="e.g. com.hdfc.community" 
                  value={formik.values.packageName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.packageName && formik.errors.packageName ? "border-red-500" : ""}
                />
                
                {isStep5Valid && (
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-4 h-4" /> Valid Android Package
                  </p>
                )}
                
                {formik.touched.packageName && formik.errors.packageName && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4" /> {formik.errors.packageName as string}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
              <Button 
                className="flex-1" 
                onClick={() => {
                  handleNext();
                  simulateAppCheck();
                }}
                disabled={!isStep5Valid}
              >
                Verify Package
              </Button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            {isCheckingApp ? (
              <div className="flex flex-col items-center justify-center p-10 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p>Searching Application...</p>
              </div>
            ) : appFound ? (
              <div className="space-y-6">
                <div className="border border-green-200 bg-green-50/30 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-green-800">Application Found</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full text-left bg-white p-4 rounded border mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Name</p>
                      <p className="font-medium text-sm">HDFC Community</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Status</p>
                      <p className="font-medium text-sm text-green-600">Connected</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground uppercase">Package</p>
                      <p className="font-medium text-sm text-muted-foreground">{formik.values.packageName}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={handleNext}>Continue</Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-amber-800 mb-2">No Android Application Found</h3>
                    <p className="text-sm text-amber-700/80 max-w-xs mx-auto">
                      You need to create your application once inside Google Play Console.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-amber-800 bg-amber-100/50 w-full p-3 rounded mt-2">
                    <span>Estimated Time</span>
                    <span className="font-medium">2 Minutes</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="w-full" onClick={() => window.open("https://play.google.com/console", "_blank")}>
                    Open Google Play Console
                  </Button>
                  <Button className="w-full" onClick={() => simulateAppCheck(true)}>
                    Refresh
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-xl font-semibold">Google Play Connected</h3>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                Everything is configured correctly. Your Android application is now ready for publishing.
              </p>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground">Service Account</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Connected</div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground">Google Play API</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Enabled</div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground">Permissions</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Verified</div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground">Package Name</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Valid</div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground">App Exists</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Yes</div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-green-50/50">
                    <TableCell className="font-medium text-green-800">Publishing Ready</TableCell>
                    <TableCell className="text-green-600">
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /></div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <Button 
              className="w-full" 
              onClick={() => {
                onComplete({
                  developerName: formik.values.developerName,
                  developerEmail: formik.values.developerEmail,
                  packageName: formik.values.packageName,
                  applicationName: "HDFC Community",
                  isConnected: true,
                  lastVerified: "Today, " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                });
              }}
            >
              Finish Setup
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Connect Google Play";
      case 2: return "Developer Information";
      case 3: return "Upload Service Account";
      case 4: return "Verification";
      case 5: return "Android Package";
      case 6: return "Check Application";
      case 7: return "Connection Summary";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded">
              Step {step} of 7
            </span>
          </div>
          <DialogTitle>{getStepTitle()}</DialogTitle>
          {step === 4 && <DialogDescription>Verifying your credentials and API access</DialogDescription>}
        </DialogHeader>
        
        <div className="py-4">
          <Progress value={(step / 7) * 100} className="h-1 mb-6" />
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
