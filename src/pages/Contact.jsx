import { Button, Input } from "../components";
import logo from "../assets/logo.svg";
import { homeConfig } from "../ultis/config";

const Contact = () => {
  return (
    <div className="mx-auto max-w-screen-xl px-4 md:mt-[9vh] mt-[17vh] h-[92vh]">
      <div className="flex flex-col justify-between h-full overflow-auto">
        <div className="flex flex-col md:flex-row px-3.5 py-5 w-full max-h-[70vh]">
          <div className="w-full md:w-1/2">
            <iframe
              className="w-full pr-3 h-full"
              id="gmap_canvas"
              src="https://maps.google.com/maps?q=20C3/75/213 Thiên Lôi Lê Chân Hải Phòng&t=&z=10&ie=UTF8&iwloc=&output=embed"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
            ></iframe>
            <br />
          </div>
          <form className="space-2 gap-2 w-full md:w-1/2 ">
            <div>
              <label htmlFor="name">Họ và tên</label>
              <Input placehoder={"Chúng tôi gọi bạn là?"} padding={"sm"} />
            </div>
            <div className="mt-3">
              <label htmlFor="phone">Số điện thoại</label>
              <Input
                placehoder={"(+84) 123456789"}
                padding={"sm"}
                type={"number"}
              />
            </div>
            <div className="mt-3">
              <label htmlFor="email">Địa chỉ email</label>
              <Input
                placehoder={"handsome_man@example.com"}
                padding={"sm"}
                type="email"
              />
            </div>
            <div className="mt-3">
              <label htmlFor="content">Nội dung</label>
              <textarea
                placeholder="whatsup ..."
                name="content"
                id="content"
                className="border-grey-light block w-full rounded border p-2 focus:border-primary focus:outline-none"
                required="abc"
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="w-full mt-2">
              <Button type="primary" size="w-full" padding={"sm"}>
                Gửi liên hệ cho chúng tôi
              </Button>
            </div>
          </form>
        </div>
        <div className="md:grid grid-cols-4 w-full hidden">
          <img src={logo} className="mx-auto" alt="ktscorp Logo" />

          <ul className="text-gray-600 ">
            <li className="mb-4 flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              {homeConfig.footer.address}
            </li>
            <li className="mb-4 flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {homeConfig.footer.wokingTime}
            </li>
            <li className="mb-4 flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              {homeConfig.footer.phone}
            </li>
            <li className="mb-4 flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              {homeConfig.footer.email}
            </li>
          </ul>
          <div>
            <h2 className="mb-6 text-sm font-medium uppercase text-gray-900">
              Follow us
            </h2>
            <ul className="text-gray-600 ">
              <li className="mb-4">
                <a
                  href="https://github.com/themesberg/flowbite"
                  className="hover:underline "
                >
                  Github
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/4eeurUVvTy"
                  className="hover:underline"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-medium uppercase text-gray-900 ">
              Legal
            </h2>
            <ul className="text-gray-600 ">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms &amp; Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
