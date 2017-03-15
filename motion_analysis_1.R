library('readr')

data1 <- read_csv("~/Documents/5th_Semester/OriGami_dev/mob_dev_sens_prototyping/squads_new/measurement_1.csv")
accZ1 <- data1$'Acceleration Z'
oriB1<- data1$'Orientation Beta'
plot(accZ1, oriB1)

data2 <- read_csv("~/Documents/5th_Semester/OriGami_dev/mob_dev_sens_prototyping/squads_new/measurement_2.csv")
accZ2 <- data2$'Acceleration Z'
oriB2<- data2$'Orientation Beta'
plot(accZ2, oriB2)
                
data3 <- read_csv("~/Documents/5th_Semester/OriGami_dev/mob_dev_sens_prototyping/squads_new/measurement_3.csv")
accZ3 <- data3$'Acceleration Z'
oriB3<- data3$'Orientation Beta'
plot(accZ3, oriB3)

data4 <- read_csv("~/Documents/5th_Semester/OriGami_dev/mob_dev_sens_prototyping/squads_new/measurement_4.csv")
accZ4 <- data4$'Acceleration Z'
oriB4<- data4$'Orientation Beta'
plot(accZ4, oriB4)

data5 <- read_csv("~/Documents/5th_Semester/OriGami_dev/mob_dev_sens_prototyping/squads_new/measurement_5.csv")
accZ5 <- data5$'Acceleration Z'
oriB5<- data5$'Orientation Beta'
plot(accZ5, oriB5)

data6 <- read_csv("~/Documents/5th_Semester/OriGami_dev/mob_dev_sens_prototyping/squads_new/measurement_6.csv")
accZ6 <- data6$'Acceleration Z'
oriB6<- data6$'Orientation Beta'
plot(accZ6, oriB6)
