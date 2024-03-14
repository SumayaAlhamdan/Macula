import "./componentsStyles.css";
function BlackButton(props){
    return(
        <button className="Black-button" onClick={props.onClick}>{props.text}</button>
    );
}
export default BlackButton;