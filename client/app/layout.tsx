import Providers from "./Provider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/index.css";
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />


export const metadata = {
  title: "Job Admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head> 
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head> 
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
