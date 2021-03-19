import { Layout } from "components";
import { SetStateAction,Dispatch } from "react";

interface Props{
  value:number;
  setValue:Dispatch<SetStateAction<number>>
}
const Login:React.FC<Props> = (props) => {
  return (
    <Layout {...props}>
      <h1>Login</h1>
    </Layout>
  );
};
export default Login;
