import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function Loader() {
  return (
    <div className="h-screen w-screen z-50 absolute grid justify-center items-center bg-white">
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 100,
              }}
              spin
            />
          }
        />
    </div>
  );
}
