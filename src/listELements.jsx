export default function ListElement(props){
    return(
        <li className = {props.selected? "selected":null} onClick={()=> props.onClick(props.id)}>{props.value}</li>
    )
}