<!DOCTYPE html>
<html>
<head>
  <title>Stephen AI Cloud</title>
</head>
<body>
  <h1>Stephen AI Memory Test</h1>
  <input id="question" placeholder="Ask Stephen something">
  <input id="answer" placeholder="Stephen's answer">
  <button onclick="saveData()">Save</button>

  <script src="https://unpkg.com/@supabase/supabase-js"></script>
  <script>
    const SUPABASE_URL = "https://ueslcvexelbnbeprafpd.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlc2xjdmV4ZWxibmJlcHJhZnBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMTM0NjAsImV4cCI6MjA3MDY4OTQ2MH0.xtzlGTqqPwqlhIWbMG4bA_2qEGC6w1Bs-KEjfdPzmvQ";
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    async function saveData() {
      let question = document.getElementById("question").value;
      let answer = document.getElementById("answer").value;
      
      const { data, error } = await supabase
        .from("stephen_memory")
        .insert([{ question: question, answer: answer }]);
      
      if (error) {
        console.error(error);
        alert("Error saving data");
      } else {
        alert("Data saved to cloud!");
      }
    }
  </script>
</body>
</html>
