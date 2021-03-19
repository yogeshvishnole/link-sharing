import React from "react"
import {Field,ErrorMessage } from "formik"
import {TextField} from "@material-ui/core"
import {makeStyles,createStyles} from "@material-ui/core/styles"

interface FormikFieldProps{
    name:string;
    label:string;
    type?:string;
    required?:boolean;
   
}

const FormikField:React.FC<FormikFieldProps> = ({name,label,type="tex",required = "false"}) => {
    const classes = useStyles()
    return <Field  fullWidth name={name} label={label} type={type} as={TextField} variant="outlined" required={required} className={classes.formikField} helperText={<ErrorMessage 
    name={name}/>}/>
}

const useStyles = makeStyles(theme => createStyles({
    formikField:{
        margin:"10px 0px"
    },error:{
        color:"red"
    }
}))

export default FormikField;