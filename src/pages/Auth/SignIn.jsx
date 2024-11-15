import {Button, Col, Flex, Form, Input, message, Row, Typography} from "antd";
import {useState, useEffect} from "react";
import useAuth from "../../service/Auth/auth";
import {Link, useNavigate} from "react-router-dom";
import logo from "../../assets/images/Logo.png";

const {Title} = Typography;

const onChange = (e) => {
    e;
};

export const SignInPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            navigate("/");
        }

        const tokenExpiry = localStorage.getItem("tokenExpiry");
        const now = new Date().getTime();
        if (tokenExpiry && now > tokenExpiry) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("tokenExpiry");
        }
    }, [navigate]);

    const onFinish = async (values) => {
        "Success:", values;
        setLoading(true);

        try {
            const response = await useAuth.signIn({
                email: values.email,
                password: values.password,
            });
            response;

            if (response) {
                localStorage.setItem("authToken", response);
                localStorage.setItem("userEmail", values.email);

                const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
                localStorage.setItem("tokenExpiry", expiryTime);

                message.open({
                    type: "success",
                    content: "Login successful",
                });
                navigate("/");
                //window.location.reload();
            } else {
                message.open({
                    type: "error",
                    content: "Invalid credentials",
                });
            }
        } catch (error) {
            message.open({
                type: "error",
                content: error.response
                    ? error.response.data.message
                    : "An error occurred during login",
            });
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        "Failed:", errorInfo;
    };

    const landingPageUrl = "https://speacialenglishcourses.com";
    const landingPage = () => {
        window.location.href = landingPageUrl;
        window.location.reload();
    };

    return (
        <Row className="min-h-screen overflow-hidden flex flex-col lg:flex-row justify-center items-center w-full">
            <Col className="w-1/3 flex justify-center items-center bg-[#fdfdfd] rounded-lg shadow-lg ">
                <Flex className="flex flex-col items-center lg:items-start justify-center gap-4 h-full p-8">
                    <Flex className="flex items-center justify-evenly">
                        <Title className="m-0 text-center">Login</Title>
                        <img src={logo} alt="logo" className="w-1/4"/>
                    </Flex>

                    <Form
                        name="sign-up-form"
                        layout="vertical"
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                        initialValues={{
                            email: "",
                            password: "",
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        requiredMark={false}
                        className="w-full"
                    >
                        <Row gutter={[8, 0]}>
                            <Col xs={24}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {required: true, message: "Please input your email"},
                                    ]}
                                >
                                    <Input placeholder="Email" allowClear onChange={onChange}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        {required: true, message: "Please input your password!"},
                                    ]}
                                >
                                    <Input.Password placeholder="Password"/>
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Flex className="flex items-center justify-between">
                                    <Button htmlType="submit" size="middle" loading={loading}>
                                        Continue
                                    </Button>
                                    <Button danger onClick={landingPage}>
                                        Back to home
                                    </Button>
                                </Flex>
                            </Col>
                        </Row>
                    </Form>
                </Flex>
            </Col>
        </Row>
    );
};
