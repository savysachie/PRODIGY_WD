document.addEventListener("DOMContentLoaded", function () {
	const navbar = document.querySelector(".navbar");

	window.addEventListener("scroll", function () {
		if (window.scrollY > 50) {
			navbar.classList.add("scrolled");
		} else {
			navbar.classList.remove("scrolled");
		}
	});

	const menuItems = document.querySelectorAll(".menu a");

	menuItems.forEach((item) => {
		item.addEventListener("mouseover", function () {
			this.style.color = "yellow";
		});

		item.addEventListener("mouseout", function () {
			this.style.color = "";
		});
	});
});
