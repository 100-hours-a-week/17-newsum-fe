console.log("✅ ENV:", import.meta.env.VITE_RELEASE_TEST_TOKEN);

export default function TestPage() {
  return (
    <div>
      RELEASE_TEST_TOKEN: {import.meta.env.VITE_RELEASE_TEST_TOKEN}
    </div>
  );
}