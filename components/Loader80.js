import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function Loader80() {
  return (
    <div
      className="fixed left-0 bottom-0 flex items-center justify-center bg-white z-50"
      style={{ width: "100%", height: "80%" }}
    >
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
