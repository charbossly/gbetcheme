import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

const Header = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-8 border-b border-gray-300">
      <h1 className="text-xl font-bold">GBÈ <span className='text-[#0064DF]'>CHÈ'MIN</span> </h1>
      <div className="flex space-x-4">
        {/* <Button variant="ghost">Se connecter</Button> */}
        <Link href={"/transcribe"}>
          <Button className='bg-[#0064DF]'>Commencer</Button>

        </Link>
      </div>
    </nav>
  );
};

export default Header;