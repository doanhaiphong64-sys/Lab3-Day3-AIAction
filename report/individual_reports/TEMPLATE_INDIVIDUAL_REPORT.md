Dưới đây là nội dung báo cáo cá nhân của bạn, được trình bày dưới dạng văn bản bình thường để bạn có thể dễ dàng copy và paste:

# Individual Report: Lab 3 - Chatbot vs ReAct Agent

**Student Name:** Nguyễn Kim Hoàng
**Student ID:** 2A202600987
**Date:** 01/06/2026

## I. Technical Contribution (15 Points)

*Describe your specific contribution to the codebase (e.g., implemented a specific tool, fixed the parser, etc.).*

* **Modules Implemented:** `frontend/components/ChatInterface.tsx` and `frontend/utils/reactParser.ts` (Handling the UI/UX for the ReAct Agent).
* **Code Highlights:**
Unlike a standard chatbot, a ReAct Agent outputs a mix of `Thought`, `Action`, and `Final Answer`. If we show this raw text to the user, it creates a terrible UX. I implemented a custom parser on the Frontend to intercept these blocks. I hid the `Thought` and `Action` inside an expandable "Thinking process" accordion, and only rendered the `Final Answer` prominently.

```typescript
// Inside frontend/utils/reactParser.ts
export const parseAgentResponse = (rawText: string) => {
  const thoughtMatch = rawText.match(/Thought:\s*(.*?)(?=Action:|Final Answer:|$)/s);
  const finalAnswerMatch = rawText.match(/Final Answer:\s*(.*)/s);

  return {
    thinkingProcess: thoughtMatch ? thoughtMatch[1].trim() : null,
    displayMessage: finalAnswerMatch ? finalAnswerMatch[1].trim() : rawText,
    // Trigger rich UI cards if the agent outputs specific JSON markers
    isHotelCard: rawText.includes("
```json\n{\n  \"hotel_name\"") 
  };
};

```

* **Documentation:** My contribution bridges the gap between the complex backend reasoning loop and the end-user. By parsing the ReAct format on the client side, I was able to build a UI that shows a loading spinner saying *"Agent is searching for hotels in Da Nang..."* (based on the `Action` step) instead of just leaving the user staring at a blank screen.

## II. Debugging Case Study (10 Points)

*Analyze a specific failure event you encountered during the lab using the logging system.*

* **Problem Description:** The Frontend crashed and failed to render the chat bubble when the Agent returned a raw JSON object from the `Google Hotels` tool directly into the `Final Answer` without summarizing it into natural language.
* **Log Source:**
*(Frontend Console Error)*
`Error: Objects are not valid as a React child (found: object with keys {hotel_name, price, available}). If you meant to render a collection of children, use an array instead.`
* **Diagnosis:** The LLM skipped generating a conversational `Final Answer` and just dumped the exact JSON `Observation` it got from the API. Because my React component expected a string for `MarkdownRenderer`, passing a raw JSON structure caused a fatal React rendering crash.
* **Solution:** I implemented a robust Error Boundary and a fallback UI on the Frontend. If the parser detects raw JSON instead of text in the final output, it intercepts it and passes it to a `RichHotelCard` component instead of the text renderer. I also gave feedback to the backend team to strengthen the prompt: *"Always format the Final Answer in Markdown, do not output raw JSON."*

## III. Personal Insights: Chatbot vs ReAct (10 Points)

*Reflect on the reasoning capability difference.*

1. **Reasoning (UX Perspective):** The `Thought` block is incredibly useful for building user trust. With a standard Chatbot, the user inputs a prompt and waits in silence. With the ReAct agent, I could display the agent's step-by-step reasoning (e.g., *"Step 1: Finding flights... Step 2: Checking hotel availability..."*). This transparency makes the user much more forgiving of the longer wait times.
2. **Reliability (Latency Issue):** The Agent performed *worse* than the Chatbot in terms of **Perceived Latency (Time-to-First-Token)**. Because the ReAct loop runs multiple times on the backend before yielding a Final Answer, the frontend sits idle for 5-10 seconds. For simple questions ("What time is check-in?"), the Chatbot feels instantly responsive, while the Agent feels sluggish.
3. **Observation:** As a frontend developer, `Observations` are powerful because they can be used to trigger dynamic UI changes. For example, if the observation text contains "No rooms available", I can program the frontend to automatically pop up a Date Picker component, prompting the user to select alternative dates without needing the Agent to explicitly ask.

## IV. Future Improvements (5 Points)

*How would you scale this for a production-level AI agent system?*

* **Scalability (Streaming/SSE):** To solve the high latency issue of the ReAct loop, I would implement Server-Sent Events (SSE) or WebSockets. Instead of waiting for the entire loop to finish, the backend should stream `Thoughts` and `Actions` in real-time so the Frontend can show a live "Thinking..." terminal to keep the user engaged.
* **Safety (Human-in-the-loop UI):** For actions like `book_room_and_pay`, the Frontend must act as the ultimate guardrail. I would implement an "Action Interceptor" UI: when the agent tries to execute a payment tool, the frontend pauses the chat and displays a strict Confirmation Modal requiring the user to click "Approve" before the backend API is actually called.
* **Performance (Optimistic UI):** For common actions like `get_weather(destination)`, I would implement Frontend caching. If the user asks for the weather in Da Nang twice, the Frontend returns the cached UI card instantly without even sending a request to the heavy ReAct backend.

```

```