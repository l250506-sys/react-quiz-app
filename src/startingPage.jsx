export function StartingPage(props){
    return(
        <>
            <header>
                <h1>Welcome to Quiz Master</h1>
            </header>
            <main>
                <button className="start-button" onClick={props.onClick}>Start Quiz</button>
            </main>
        </>
    )
}