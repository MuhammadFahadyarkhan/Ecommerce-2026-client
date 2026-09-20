import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserData } from '@/context/UserContext'
import { Loader } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState("") 

  const navigate = useNavigate()

  const { loginUser,btnLoading } = UserData()

  const submitHandler = () => {
    loginUser(email,navigate);
  }
  return (
    <div className='min-h-[60vh] flex items-center justify-center p-4'>
      <Card className="w-full max-w-md shadow-lg border bg-card text-card-foreground p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-lg font-semibold">
            Enter Email to get Otp
          </CardTitle>
          <CardDescription>
            if you have already got otp on mail then you can directly go to otp tab
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 space-y-4">
          <div className='flex flex-col space-y-2 pt-2'>
            <Label>
              Enter Email
            </Label>
            <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          {/* Removed w-full so the button stays compact and matches the video */}
          <Button disabled={btnLoading} onClick={submitHandler} className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
            {btnLoading ? <Loader /> :"Submit"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login