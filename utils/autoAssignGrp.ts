



import { GroupModel } from "@/lib/models/group";

export default async function assignUserToGroup(user: any) {

  // #1. Announcement Group (everyone joins)
  let announcementGroup = await GroupModel.findOne({ type: "announcement" });

  if (!announcementGroup) {
    announcementGroup = await GroupModel.create({
      name: "University Announcement",
      type: "announcement",
      members: []
    });
  }

  await GroupModel.updateOne(
    { _id: announcementGroup._id },
    { $addToSet: { members: user._id } }
  );


  // ##2. Faculty Logic
  if (user.role === "faculty") {

    let facultyGroup = await GroupModel.findOne({ type: "faculty" });

    if (!facultyGroup) {
      facultyGroup = await GroupModel.create({
        name: "Faculty Chat",
        type: "faculty",
        members: []
      });
    }

    await GroupModel.updateOne(
      { _id: facultyGroup._id },
      { $addToSet: { members: user._id } }
    );

  } else {

    // ###3.  Student Year Logic
    const groupName = `${user.department}-${user.year}`;

    let studentGroup = await GroupModel.findOne({
      type: "student",
      department: user.department,
      year: user.year
    });

    if (!studentGroup) {
      studentGroup = await GroupModel.create({
        name: groupName,
        type: "student",
        department: user.department,
        year: user.year,
        members: []
      });
    }

    await GroupModel.updateOne(
      { _id: studentGroup._id },
      { $addToSet: { members: user._id } }
    );
  }
}