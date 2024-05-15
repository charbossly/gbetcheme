
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChartIcon, BoltIcon } from "lucide-react"

export default function Component() {
  return (
    <div className="bg-white pt-14 flex flex-col ">

      <div className="flex flex-row max-lg:flex-col  items-center px-0 py-16 mx-10 justify-center lg:mb-11 ">
        <div className="max-w-md max-lg:mb-14 max-lg:text-center max-lg:flex max-lg:flex-col lg:mx-4 justify-center items-center ">
          <h1 className="text-4xl font-bold leading-tight mb-4">Briser les barrières Linguistiques</h1>
          <p className="text-lg mb-8">Local language translations, powered by Zenith</p>
          <Button className="flex items-center shadow-md bg-[#0064DF]">
            <FileIcon className="mr-2 shadow-sm " />
            Choisir un fichier
          </Button>
        </div>

        {/* <div className="">

        </div> */}


        <div className="relative ">
          <div className="w-[500px]">
          <img
            alt="Language translation"
            className="rounded-lg"
            height="200"
            src="/Container1.png"
            style={{
              aspectRatio: "500/300",
              objectFit: "cover",
            }}
            // width="400"
          />
          </div>
          
          <Button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-4 rounded-full">
            <PlayIcon className="text-2xl" />
          </Button>

          <div className="p-6 golix backdrop-blur-sm shadow-lg max-lg:hidden rounded-lg max-w-[250px] absolute top-3 -right-24  ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Hello and Welcome !</h3>
              <span className="text-sm">02:00</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <span className="text-sm">Kaabo ati Kaabo!</span>
                <CircleCheckIcon className="text-green-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                <span className="text-sm">How are you ?</span>
                <CircleCheckIcon className="text-green-500" />
              </div>
            </div>
          </div>
        </div>

      </div>


      <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-12">
        Libérez la croissance mondiale de la vidéo en un seul clic
      </h1>
      <div className="flex justify-center relative">
        {/* <div className="flex justify-between items-center mb-4">
          <Select>
            <SelectTrigger id="language">
              <SelectValue placeholder="Français" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="yo">Yoruba</SelectItem>
              <SelectItem value="fon">Fon</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Ouvrir un compte</Button>
        </div> */}
        {/* <div className="flex justify-center"> */}
          <img
            alt="Video call"
            className="rounded-lg overflow-hidden mb-8 object-cover"
            // height="200"
            src="/hero3.png"
            // style={{
            //   aspectRatio: "300/200",
            //   objectFit: "cover",
            // }}
            // width="300"
          />

          {/* <div className=" h-[30px] absolute bottom-16 bg-[#d6e4f6] rounded-lg z-20 px-4">

          </div> */}
        {/* </div> */}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card className="w-full">
          <CardHeader>
            <BoltIcon className="h-6 w-6 text-[#0064DF]" />
            <CardTitle>Précision accrue</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Notre outil basé sur l'IA détecte et suit avec précision les visages détectés, garantissant une vidéo
              parfaite pour tous vos participants.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <AlignCenterHorizontalIcon className="h-6 w-6 text-[#0064DF]" />
            <CardTitle>Options au choix</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Vous pouvez choisir comment votre vidéo est diffusée! Avec notre outil, vous pouvez soit laisser l'IA
              décider, soit prendre le contrôle et la modifier à la main.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <BarChartIcon className="h-6 w-6 text-[#0064DF]" />
            <CardTitle>Fonctionnaire sur importe quel appareil</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Notre outil fonctionne sur Mac et Windows, iPhone et Android, ainsi que sur les navigateurs les plus
              récents.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>

    </div>
  )
}

function CircleCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}


function FileIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}


function PlayIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}

function AlignCenterHorizontalIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12h20" />
      <path d="M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" />
      <path d="M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4" />
      <path d="M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1" />
      <path d="M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1" />
    </svg>
  )
}
