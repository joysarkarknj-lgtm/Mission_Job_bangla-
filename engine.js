let current=0,answers=[],timeLeft=0,timerId=null,submitted=false;
const $=id=>document.getElementById(id);
function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$(id).classList.add("active")}
function init(){
 answers=Array(questions.length).fill(null);
 $("testTitle").textContent=TEST_CONFIG.title;
 $("totalQ").textContent=questions.length;
 $("duration").textContent=TEST_CONFIG.durationMinutes;
 $("perMark").textContent=TEST_CONFIG.marksPerCorrect;
 $("negative").textContent=TEST_CONFIG.negativePerWrong;
}
function validate(){
 let n=$("name").value.trim(),m=$("mobile").value.trim();
 if(!n)return alert("আপনার নাম লিখুন।");
 if(!/^\d{10}$/.test(m))return alert("সঠিক ১০ সংখ্যার মোবাইল নম্বর দিন।");
 return true;
}
function start(){
 if(!validate())return;
 current=0;submitted=false;timeLeft=TEST_CONFIG.durationMinutes*60;
 show("quizScreen");render();startTimer();
}
function startTimer(){
 clearInterval(timerId);updateTimer();
 timerId=setInterval(()=>{timeLeft--;updateTimer();if(timeLeft<=0){clearInterval(timerId);submitTest(true)}},1000);
}
function updateTimer(){
 let m=Math.floor(timeLeft/60),s=timeLeft%60;
 $("timer").textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
 if(timeLeft<=60)$("timer").classList.add("danger");
}
function render(){
 let q=questions[current];
 let html=`<div class="question-number">প্রশ্ন ${current+1}</div><div class="question">${q.q}</div>`;
 q.options.forEach((o,i)=>{
  html+=`<label class="option ${answers[current]===i?"selected":""}">
  <input type="radio" name="opt" ${answers[current]===i?"checked":""} value="${i}">
  <span><b>${String.fromCharCode(65+i)}.</b> ${o}</span></label>`;
 });
 $("progressText").textContent=`প্রশ্ন ${current+1} / ${questions.length}`;
 $("progressBar").style.width=`${((current+1)/questions.length)*100}%`;
 $("questionCard").innerHTML=html;
 document.querySelectorAll('input[name="opt"]').forEach(x=>x.addEventListener("change",e=>{
  answers[current]=Number(e.target.value);render();
 }));
 $("prevBtn").classList.toggle("hidden",current===0);
 $("nextBtn").classList.toggle("hidden",current===questions.length-1);
 $("submitBtn").classList.toggle("hidden",current!==questions.length-1);
}
function submitTest(auto=false){
 if(submitted)return;
 if(!auto&&!confirm("আপনি কি পরীক্ষা জমা দিতে চান?"))return;
 submitted=true;clearInterval(timerId);
 let correct=0,wrong=0,unanswered=0;
 answers.forEach((a,i)=>{
  if(a===null)unanswered++;
  else if(a===questions[i].answer)correct++;
  else wrong++;
 });
 let score=correct*TEST_CONFIG.marksPerCorrect-wrong*TEST_CONFIG.negativePerWrong;
 let total=questions.length*TEST_CONFIG.marksPerCorrect;
 let percentage=total?(score/total)*100:0;
 $("score").textContent=`${score} / ${total}`;
 $("correct").textContent=correct;
 $("wrong").textContent=wrong;
 $("unanswered").textContent=unanswered;
 $("percentage").textContent=`${percentage.toFixed(2)}%`;
 $("candidateInfo").textContent=`${$("name").value.trim()} • ${$("mobile").value.trim()}`;
 show("resultScreen");
}
function review(){
 let html="<h2>উত্তর পর্যালোচনা</h2>";
 questions.forEach((q,i)=>{
  let a=answers[i],unanswered=a===null,correct=!unanswered&&a===q.answer;
  html+=`<div class="review-item ${unanswered?"unanswered":correct?"correct":"wrong"}">
  <div class="review-q">${i+1}. ${q.q}</div>
  <div>আপনার উত্তর: <b>${unanswered?"দেওয়া হয়নি":String.fromCharCode(65+a)+". "+q.options[a]}</b></div>
  <div>সঠিক উত্তর: <b>${String.fromCharCode(65+q.answer)}. ${q.options[q.answer]}</b></div>
  <div>${unanswered?"⚠ উত্তর দেওয়া হয়নি":correct?"✓ সঠিক":"✕ ভুল"}</div></div>`;
 });
 $("review").innerHTML=html;$("review").scrollIntoView({behavior:"smooth"});
}
$("startBtn").onclick=start;
$("nextBtn").onclick=()=>{if(current<questions.length-1){current++;render()}};
$("prevBtn").onclick=()=>{if(current>0){current--;render()}};
$("submitBtn").onclick=()=>submitTest(false);
$("reviewBtn").onclick=review;
$("restartBtn").onclick=()=>location.reload();
init();