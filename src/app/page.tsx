"use client"

import { useState } from "react"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { generateEmailContent } from "./actions"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function EmailTemplate() {
  const [hasPreviousThread, setHasPreviousThread] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [responseContext, setResponseContext] = useState("")
  const [previousThread, setPreviousThread] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("compose")
  const { toast } = useToast()

  const generateEmail = async () => {
    if (!customerName) {
      toast({
        title: "Missing information",
        description: "Please enter the customer name",
        variant: "destructive",
      })
      return
    }

    if (!responseContext) {
      toast({
        title: "Missing information",
        description: "Please enter the response context",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const result = await generateEmailContent(customerName, responseContext, hasPreviousThread, previousThread)
      if (result.success && result.content) {
        setEmailContent(result.content)
        setActiveTab("preview")
        toast({
          title: "Email generated",
          description: "Your email has been successfully generated",
        })
      } else {
        toast({
          title: "Generation failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">AI Email Generator for Customer Success</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Email Composer</CardTitle>
              <CardDescription>Fill in the details and let AI generate a professional follow-up email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="previousThread"
                  checked={hasPreviousThread}
                  onCheckedChange={(checked) => setHasPreviousThread(checked === true)}
                />
                <Label htmlFor="previousThread">Previous email thread exists</Label>
              </div>

              {hasPreviousThread && (
                <div className="space-y-2">
                  <Label htmlFor="thread">Previous Email Thread</Label>
                  <Textarea
                    id="thread"
                    placeholder="Paste the previous email thread here..."
                    className="min-h-[100px]"
                    value={previousThread}
                    onChange={(e) => setPreviousThread(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="context">Response Context</Label>
                <Textarea
                  id="context"
                  placeholder="Enter key points to address, customer issues, or any specific information to include..."
                  className="min-h-[150px]"
                  value={responseContext}
                  onChange={(e) => setResponseContext(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={generateEmail} disabled={isGenerating} className="w-full sm:w-auto">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Email with AI"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Email Preview</CardTitle>
              <CardDescription>Preview and copy your AI-generated email</CardDescription>
            </CardHeader>
            <CardContent>
              {emailContent ? (
                <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">{emailContent}</div>
              ) : (
                <p className="text-muted-foreground">Generate an email to see the preview</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => navigator.clipboard.writeText(emailContent)}
                disabled={!emailContent}
                className="w-full sm:w-auto"
              >
                Copy to Clipboard
              </Button>
              <Button variant="outline" onClick={() => setActiveTab("compose")} className="w-full sm:w-auto">
                Back to Editor
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}
