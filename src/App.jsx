import DocumentLibrary from "./components/DocumentLibrary";
import ExamSchedule from "./components/ExamSchedule";
import HomeDashboard from "./components/Home";
import NotesLibrary from "./components/NotesLibrary";

export default function Home() {
  return (
    <>
      <HomeDashboard />
      <DocumentLibrary />
      <ExamSchedule />
      <NotesLibrary />
    </>
  );
}
