"use server"

import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function generateEmailContent(
  customerName: string,
  responseContext: string,
  hasPreviousThread: boolean,
  previousThread: string,
) {
  try {
    // Create a prompt for the AI model
    const prompt = `You are a professional customer success manager writing an email to a customer.
    
Customer name: ${customerName}

${hasPreviousThread ? `Previous email thread:\n${previousThread}\n\n` : ""}

Latest response: ${responseContext}

Write a professional, friendly, and helpful email that addresses the customer's needs based on the latest response provided.
If there's a previous email thread, make sure your response acknowledges and builds upon that conversation.
The email should have a proper greeting, body, and sign-off.`

    // Generate the email using the AI SDK
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
    })

    return { success: true, content: text }
  } catch (error) {
    console.error("Error generating email:", error)
    return {
      success: false,
      error: "Failed to generate email. Please try again.",
    }
  }
}

