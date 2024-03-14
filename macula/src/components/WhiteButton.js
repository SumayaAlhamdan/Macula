import "./componentsStyles.css";
function WhiteButton(props){
    return(
        <button className="White-button" onClick={props.onClick}>{props.text}</button>
    );
}
export default WhiteButton;