import ProfileForm from "@/components/auth/profile-form";
import { getProfile } from "@/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const page = async () => {
  const profile = await getProfile();

  if (!profile?.data?.data) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <ProfileForm profile={profile.data.data} />
      </CardContent>
    </Card>
  );
};

export default page;
