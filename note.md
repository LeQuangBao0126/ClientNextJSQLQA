Chuyển từ 1 constant chứa các value . thành 1 Type trong typescript 

const Role = {
    "MANAGER":"MANAGER",
    "USER" :"USER",
    "ADMIN":"ADMIN"
} as const 

exprot type RoleType = (typeof Role)[keyof typeof Role ]

=> thành RoleType = "MANAGER" | "USER" | "ADMIN"