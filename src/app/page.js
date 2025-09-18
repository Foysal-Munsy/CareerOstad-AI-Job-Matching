import HomePage from "@/components/HomePage";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <HomePage />      
      <Link href='/Products' className="btn ">Terms and Condition</Link>
    </div>
  );
}