import { Form, Input } from "antd";

const InputIn = ({ rules, ...props }) => {
  return (
    <Form.Item {...props} label={props.label} name={props.name} rules={rules}>
      <Input placeholder={props.placeholder} {...props} />
    </Form.Item>
  );
};

export default InputIn;
