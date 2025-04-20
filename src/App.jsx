import DocumentLibrary from "./components/DocumentLibrary";
import ExamSchedule from "./components/ExamSchedule";
import HomeDashboard from "./components/Home";

export default function Home() {
  return (
    <>
      <HomeDashboard />
      <DocumentLibrary />
      <ExamSchedule />
    </>
  );
}
