async function uploadResumes() {
  const fileInput = document.getElementById("resumeFiles");
  const files = fileInput.files;
  const formData = new FormData();
  for (const file of files) {
      formData.append("resumes", file);
  }

  const response = await fetch("/upload", {
      method: "POST",
      body: formData
  });

  const data = await response.json();
  displayProfiles(data.profiles);
}

function displayProfiles(profiles) {
  const profilesContainer = document.getElementById("profiles");
  profilesContainer.innerHTML = ""; // Clear previous profiles

  profiles.forEach(profile => {
      const profileDiv = document.createElement("div");
      profileDiv.classList.add("profile");
      profileDiv.innerHTML = `
          <h3>${profile.name}</h3>
          <p><strong>Email:</strong> ${profile.email}</p>
          <p><strong>LinkedIn:</strong> <a href="https://${profile.linkedin}" target="_blank">${profile.linkedin}</a></p>
          <p><strong>Skills:</strong> ${profile.skills.join(", ")}</p>
      `;
      profilesContainer.appendChild(profileDiv);
  });
}
