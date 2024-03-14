import "./componentsStyles.css";
function OrangeButton
(props){
    return(
        <button className="Orange-button" onClick={props.onClick}>{props.text}</button>
    );
}
export default OrangeButton
;