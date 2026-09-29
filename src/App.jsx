import React from "react"
import { StartingPage } from "./startingPage";
import ListElement from "./listELements";

export default function App (){

  const totalQuestions  = 10

  const [quizStarted,setQuizStarted] = React.useState(false);

  const [quizData,setQuizData] = React.useState([]);

  const [questionNumber,setQuestionNumber] = React.useState(0);
  
  const [allAnswers,setAllAnswers] = React.useState([]);

  const [selectedAnswer,setSelectedAnswer] = React.useState(Array(totalQuestions).fill(""));

  const [quizEnd,setQuizEnd] = React.useState(false);

  const indexObj ={
    0:"A",
    1:"B",
    2:"C",
    3:"D"
  }

  function startQuiz(){
    setQuizStarted(true)
  }

  React.useEffect(()=>{
    fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple")
      .then(res => res.json())
      .then(data => {
        const result = data.results;
        setQuizData(result);

        setAllAnswers([...result[questionNumber].incorrect_answers,result[questionNumber].correct_answer]
          .map((el,index)=>
            {  return ({
              value:el,
              selected: false,
              correct: el === result[questionNumber].correct_answer? true: false,
              id:index
            })}
          ).sort(()=> Math.random()-0.5)
        )
      });

        
  },[quizEnd])

 const answerElements = allAnswers.length> 0 && allAnswers.map((el,index) => 
  <ListElement 
    value = {`${indexObj[index]}. ${el.value}`}
    key={index}
    id={el.id}
    onClick = {listElCLicked}
    selected = {el.selected}
    />
 )

 function listElCLicked(id){
  setAllAnswers(prevArray =>
    prevArray.map(obj =>
      obj.id === id? 
      {
        ...obj,
        selected: !obj.selected
      }:
      {
        ...obj,
        selected:false
      }
    )
  )
 }

 const isAnyAnswerSelected = allAnswers.some(answer => answer.selected);



 function nextBtnClicked(){
  const chosenAnswer = allAnswers.find(ans => ans.selected);
  setSelectedAnswer(prevArray => 
    prevArray.map((el,index)=>
      index === questionNumber?
        chosenAnswer:el
    )
  )
  setQuestionNumber(prevQuestion => prevQuestion+1);
 }

 function prevBtnClicked(){
  setQuestionNumber(prevQuestion => prevQuestion-1)
 }

 React.useEffect(()=>{
  if(quizData.length >0){
    setAllAnswers([...quizData[questionNumber].incorrect_answers,
    quizData[questionNumber].correct_answer]
    .map((el,index)=>{
       return {value:el,
      selected:false,
      correct: quizData[questionNumber].correct_answer === el? true:false,
      id:index
      }
      }).sort(()=> Math.random()-0.5)
    )
  }
 },[questionNumber])

 const lastQuestion = questionNumber ===9? true:false

 function calculateScore(){
  let count = 0
  selectedAnswer.forEach(({correct})=>{
    correct? count++: count = count
  })
  return count
 }

 function endQuiz(){
  setQuizEnd(true)
 }

 function retake(){
  setQuizStarted(false);
  setQuizEnd(false);
  setQuestionNumber(0);
  setSelectedAnswer(Array(totalQuestions).fill(""));
 }
  
  
  return(
    <>
      {!quizStarted && <StartingPage onClick={startQuiz}/>}
      {!quizEnd && quizStarted &&  <header className="quiz-header">
        <h1>Quiz</h1>
      </header>}
      {!quizEnd && quizStarted&& <main>
        <section className="question">
          <h2>{quizData.length !== 0? quizData[questionNumber].question : null}</h2>
        </section>
        <section className="answers">
          <ul>
            {answerElements}
          </ul>
        </section>
        <section className="progress">
          <label htmlFor="progress-bar">{`Question ${questionNumber+1} of ${totalQuestions}`}</label>
          <progress value ={(questionNumber+1)} max={totalQuestions} id="progress-bar"></progress>
        </section>
        <section className="next">
          <button className={`next-btn ${isAnyAnswerSelected? "On":null}`} disabled={!isAnyAnswerSelected} onClick={questionNumber ===9?endQuiz:nextBtnClicked}>{questionNumber ===9? "View Result":"Next"}</button>
          <button className={`previous-btn ${questionNumber>0? "On":null}`} disabled={questionNumber>0?false:true} onClick={prevBtnClicked}>Previous</button>
        </section>
      </main>}
      {quizEnd && <header>
        <h1>Quiz Results</h1>
      </header>}
      {quizEnd &&<main className="final-screen">
        <section className="score">
          <i className="fa-solid fa-medal"></i>
          <h2><span>{calculateScore()}</span>/10</h2>
          <h4>{calculateScore() > 5? "Fantastic work! You aced this quiz!":"You need some work on your skills" }</h4>
        </section>
        <section className="performance">
          <h1>Your Performance</h1>
          <div className="rrect">
            <div className="together">
              <i className="fa-solid fa-circle-check"></i>
              <h1>Correct Answers</h1>
            </div>
            <h2>{calculateScore()}</h2>
          </div>
          <div className="rrect">
            <div className="together">
              <i className="fa-solid fa-circle-xmark"></i>
              <h1>Incorrect Answers</h1>
            </div>
            <h2>{totalQuestions - calculateScore()}</h2>
          </div>
        </section>
        <section className="retake">
          <button className="next-btn On" onClick={retake}>
            Retake Quiz
          </button>
        </section>
      </main>}
    </>
  )
}
